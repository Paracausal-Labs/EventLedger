"use client";

import { useEffect, useRef, useState } from "react";

// Module-level singleton: mermaid is initialized once across all instances
let mermaidInitialized = false;
let mermaidInstance: typeof import("mermaid").default | null = null;

async function getMermaid() {
    if (!mermaidInstance) {
        mermaidInstance = (await import("mermaid")).default;
    }
    if (!mermaidInitialized) {
        mermaidInstance.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
                primaryColor: "#06b6d4",
                primaryTextColor: "#ffffff",
                primaryBorderColor: "#06b6d4",
                lineColor: "#06b6d4",
                secondaryColor: "#171717",
                tertiaryColor: "#262626",
                background: "#0A0A0A",
                mainBkg: "#171717",
                secondBkg: "#262626",
                textColor: "#ffffff",
                border1: "#333333",
                border2: "#06b6d4",
                fontSize: "16px",
            },
        });
        mermaidInitialized = true;
    }
    return mermaidInstance;
}

// Global counter for unique render IDs
let renderCounter = 0;

interface MermaidDiagramProps {
    chart: string;
    id: string;
    className?: string;
}

export function MermaidDiagram({ chart, id, className = "" }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [renderId] = useState(() => `mermaid-${id}-${++renderCounter}`);

    useEffect(() => {
        let cancelled = false;

        const renderDiagram = async () => {
            if (!containerRef.current) return;

            try {
                const mermaid = await getMermaid();

                if (cancelled) return;

                // Use mermaid.render() to get SVG string directly
                // This avoids querySelector/duplicate-ID issues entirely
                const { svg } = await mermaid.render(renderId, chart.trim());

                if (cancelled || !containerRef.current) return;

                containerRef.current.innerHTML = svg;
            } catch (error) {
                console.error("Error rendering Mermaid diagram:", error);
                if (containerRef.current && !cancelled) {
                    containerRef.current.innerHTML = `<div class="text-red-500 p-4">Error rendering diagram: ${error instanceof Error ? error.message : "Unknown error"}</div>`;
                }
            }
        };

        renderDiagram();

        return () => {
            cancelled = true;
        };
    }, [chart, renderId]);

    return (
        <div
            ref={containerRef}
            className={`mermaid-container ${className}`}
            suppressHydrationWarning
        />
    );
}
