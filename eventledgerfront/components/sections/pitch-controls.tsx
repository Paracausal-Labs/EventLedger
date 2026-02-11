"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { usePresenterStore } from "@/store/presenter-store"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { WALRUS_ASCII } from "@/lib/ascii"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useRouter, usePathname } from "next/navigation"
import { FileCode2 } from "lucide-react"
const SECTIONS = [
    { id: "hero", label: "Intro", time: "0-2m" },
    { id: "problem", label: "Problem", time: "2-5m" },
    { id: "mvp", label: "MVP", time: "5-9m" },
    { id: "architecture", label: "Arch", time: "9-14m" },
    { id: "ensure", label: "ENSure", time: "14-17m" },
    { id: "timeline", label: "Timeline", time: "17-22m" },
    { id: "ecosystem", label: "Impact", time: "22-25m" },
    { id: "risks", label: "Risks", time: "25-28m" },
    { id: "close", label: "Next", time: "28-30m" },
]

export function PitchControls() {
    const router = useRouter()
    const pathname = usePathname()
    const { isPresenterMode, togglePresenterMode } = usePresenterStore()
    const activeId = useScrollSpy(SECTIONS.map((s) => s.id), 100)

    // Calculate progress
    const activeIndex = SECTIONS.findIndex((s) => s.id === activeId)
    const progress = activeIndex === -1 ? 0 : ((activeIndex + 1) / SECTIONS.length) * 100

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 80, // Offset for sticky header
                behavior: "smooth",
            })
        }
    }

    return (
        <motion.header
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <div className="relative select-none w-fit origin-left scale-75 sm:scale-100 lg:scale-125">
                        <pre className="text-[2px] leading-[2px] text-white/90 font-bold whitespace-pre block">
                            {WALRUS_ASCII}
                        </pre>
                        <span className="absolute -bottom-3 -right-2 text-cyan-400 font-mono text-[8px] font-bold tracking-widest scale-75 origin-top-left">
                            v1.0.0
                        </span>
                    </div>
                </div>

                {/* Center: Progress */}
                <div className="hidden flex-1 px-8 md:flex md:flex-col gap-1 max-w-xl">
                    <Progress value={progress} className="h-1" />
                    {isPresenterMode && (
                        <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                            <span>Start</span>
                            <span>{SECTIONS[activeIndex]?.time || "30m"}</span>
                            <span>Finish</span>
                        </div>
                    )}
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex gap-1">
                        {["mvp", "architecture", "timeline", "risks"].map((key) => (
                            <Button
                                key={key}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "text-xs capitalize",
                                    activeId === key ? "text-primary bg-primary/10" : "text-muted-foreground"
                                )}
                                onClick={() => scrollToSection(key)}
                            >
                                {key}
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "text-xs gap-1.5",
                                pathname === "/technical" ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                            onClick={() => router.push("/technical")}
                        >
                            <FileCode2 className="w-3 h-3" />
                            Technical
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                        <span className={cn("text-xs font-medium", isPresenterMode ? "text-primary" : "text-muted-foreground")}>
                            Presenter
                        </span>
                        <Switch
                            checked={isPresenterMode}
                            onCheckedChange={togglePresenterMode}
                        />
                    </div>
                </div>
            </div>
        </motion.header>
    )
}
