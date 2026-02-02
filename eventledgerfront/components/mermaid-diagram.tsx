"use client";

import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
    chart: string;
    id: string;
    className?: string;
}

export function MermaidDiagram({ chart, id, className = "" }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current) return;

            try {
                // Dynamically import mermaid to avoid SSR issues
                const mermaid = (await import("mermaid")).default;

                // Initialize mermaid with dark theme matching your color scheme
                mermaid.initialize({
                    startOnLoad: false,
                    theme: "dark",
                    themeVariables: {
                        primaryColor: "#06b6d4", // Your cyan accent
                        primaryTextColor: "#ffffff",
                        primaryBorderColor: "#06b6d4",
                        lineColor: "#06b6d4",
                        secondaryColor: "#171717", // Your card background
                        tertiaryColor: "#262626", // Your muted background
                        background: "#0A0A0A", // Your main background
                        mainBkg: "#171717",
                        secondBkg: "#262626",
                        textColor: "#ffffff",
                        border1: "#333333",
                        border2: "#06b6d4",
                        fontSize: "16px",
                    },
                });

                // Clear previous content
                containerRef.current.innerHTML = chart;

                // Render the diagram
                await mermaid.run({
                    querySelector: `#${id}`,
                });
            } catch (error) {
                console.error("Error rendering Mermaid diagram:", error);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<div class="text-red-500">Error rendering diagram</div>`;
                }
            }
        };

        renderDiagram();
    }, [chart, id]);

    return (
        <div
            id={id}
            ref={containerRef}
            className={`mermaid-container ${className}`}
            suppressHydrationWarning
        />
    );
}
