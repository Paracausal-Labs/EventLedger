"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MermaidFullscreenViewerProps {
    isOpen: boolean;
    onClose: () => void;
    diagramId: string;
    title: string;
}

export function MermaidFullscreenViewer({
    isOpen,
    onClose,
    diagramId,
    title,
}: MermaidFullscreenViewerProps) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset zoom and position when opening — default to 450%
    useEffect(() => {
        if (isOpen) {
            setZoom(4.5);
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen]);

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 5));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.25));
    };

    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom((prev) => Math.max(0.25, Math.min(5, prev + delta)));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{title}</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Use mouse wheel to zoom • Click and drag to pan
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-white/10"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleZoomIn();
                        }}
                        className="bg-card/90 backdrop-blur-sm hover:bg-card border border-border"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleZoomOut();
                        }}
                        className="bg-card/90 backdrop-blur-sm hover:bg-card border border-border"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="bg-card/90 backdrop-blur-sm hover:bg-card border border-border"
                        title="Reset View"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                    <div className="bg-card/90 backdrop-blur-sm border border-border rounded-md px-3 py-2 text-center">
                        <span className="text-xs font-mono text-muted-foreground">
                            {Math.round(zoom * 100)}%
                        </span>
                    </div>
                </div>

                {/* Diagram Container */}
                <div
                    ref={containerRef}
                    className="absolute inset-0 overflow-hidden cursor-move"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <motion.div
                        className="w-full h-full flex items-center justify-center p-20"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                            transformOrigin: "center center",
                            transition: isDragging ? "none" : "transform 0.1s ease-out",
                        }}
                    >
                        <div
                            className="bg-background/50 border border-border rounded-xl p-8 backdrop-blur-sm"
                            dangerouslySetInnerHTML={{
                                __html: document.getElementById(diagramId)?.querySelector(".mermaid-container")?.innerHTML || "",
                            }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
