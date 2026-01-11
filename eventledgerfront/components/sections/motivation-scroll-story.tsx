"use client"

import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Check, ArrowRight, Code2, Layers, Database, Lock, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePresenterStore } from "@/store/presenter-store"

gsap.registerPlugin(ScrollTrigger)

const BEATS = [
    {
        id: "beat1",
        headline: "This RFP matched exactly what we were already building toward.",
        subline: "Events are where identity, access, and reputation collide.",
    },
    {
        id: "beat2",
        headline: "New stack, same execution.",
        subline: "New stack, same execution discipline.",
    },
    {
        id: "beat3",
        headline: "We've already started building on Sui.",
        subline: "We’ve already shipped a Sui proof-of-work and are scaling from there.",
    },
    {
        id: "beat4",
        headline: "ENSure proved the need. Walrus makes it real infrastructure.",
        subline: "Walrus is the missing layer: verifiable storage + encrypted access.",
    },
]

export function MotivationScrollStory() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { isPresenterMode } = usePresenterStore()

    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            // Main Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=2500", // Pin distance
                    pin: true,
                    scrub: 1,
                }
            })

            const texts = gsap.utils.toArray<HTMLElement>(".beat-text")
            const cards = gsap.utils.toArray<HTMLElement>(".beat-card")

            // Initial setup - Hide all except first
            texts.forEach((el, i) => {
                if (i !== 0) gsap.set(el, { autoAlpha: 0, y: 20 })
            })
            cards.forEach((el, i) => {
                if (i !== 0) gsap.set(el, { autoAlpha: 0, y: 50, scale: 0.95 })
            })

            // --- Beat 1 -> Beat 2 ---
            tl.to(texts[0], { autoAlpha: 0, y: -20, duration: 1 })
                .to(cards[0], { autoAlpha: 0, scale: 0.95, y: -50, duration: 1 }, "<")

                .to(texts[1], { autoAlpha: 1, y: 0, duration: 1 })
                .to(cards[1], { autoAlpha: 1, scale: 1, y: 0, duration: 1 }, "<")

                // --- Beat 2 -> Beat 3 ---
                .to(texts[1], { autoAlpha: 0, y: -20, duration: 1 }, "+=0.5")
                .to(cards[1], { autoAlpha: 0, scale: 0.95, y: -50, duration: 1 }, "<")

                .to(texts[2], { autoAlpha: 1, y: 0, duration: 1 })
                .to(cards[2], { autoAlpha: 1, scale: 1, y: 0, duration: 1 }, "<")

                // --- Beat 3 -> Beat 4 ---
                .to(texts[2], { autoAlpha: 0, y: -20, duration: 1 }, "+=0.5")
                .to(cards[2], { autoAlpha: 0, scale: 0.95, y: -50, duration: 1 }, "<")

                .to(texts[3], { autoAlpha: 1, y: 0, duration: 1 })
                .to(cards[3], { autoAlpha: 1, scale: 1, y: 0, duration: 1 }, "<")

                // --- Beat 4 Hold ---
                .to({}, { duration: 1 })

                // --- Final Transition: Fade out to Next Section ---
                .to(".next-indicator", { autoAlpha: 1, duration: 0.5 })

        })

    }, { scope: containerRef, dependencies: [isPresenterMode] })

    return (
        <section ref={containerRef} className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0B0F12] py-24 overflow-hidden">

            <div className="container relative mx-auto grid h-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center">

                {/* Left Column: Headlines */}
                <div className="relative h-[200px] flex flex-col justify-center">
                    {BEATS.map((beat, i) => (
                        <div key={beat.id} className={cn("beat-text absolute top-0 left-0 w-full", i === 0 ? "opacity-100" : "opacity-0")}>
                            <h2 className={cn(
                                "mb-4 font-bold leading-tight tracking-tighter text-white transition-all",
                                isPresenterMode ? "text-5xl" : "text-4xl"
                            )}>
                                {beat.headline}
                            </h2>
                            <p className={cn(
                                "text-slate-400 font-medium",
                                isPresenterMode ? "text-2xl" : "text-xl"
                            )}>
                                {beat.subline}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right Column: Story Rail */}
                <div className="relative h-[400px] w-full flex items-center justify-center perspective-1000">

                    {/* Beat 1: Direction */}
                    <Card className="beat-card absolute w-full max-w-md border-white/10 bg-slate-900/50 p-8 flex flex-col items-center justify-center gap-6 backdrop-blur-md">
                        <div className="flex items-center gap-4 text-2xl font-bold text-white">
                            <span>ENSure</span>
                            <ArrowRight className="h-6 w-6 text-slate-500 animate-pulse" />
                            <span className="text-cyan-400">EventLedger</span>
                        </div>
                        <div className="flex gap-3">
                            {["Identity", "Tickets", "Attendance"].map((tag) => (
                                <Badge key={tag} variant="outline" className="border-cyan-500/30 text-cyan-400">{tag}</Badge>
                            ))}
                        </div>
                    </Card>

                    {/* Beat 2: Execution */}
                    <Card className="beat-card absolute w-full max-w-md border-white/10 bg-slate-900/50 p-8 backdrop-blur-md opacity-0">
                        <h3 className="mb-6 text-xl font-bold text-white">Execution Capabilities</h3>
                        <div className="space-y-4">
                            {[
                                "Ship full-stack under hackathon timelines",
                                "Integrate identity / ZK flows cleanly",
                                "Design schemas + contracts that others can reuse"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="rounded-full bg-green-500/20 p-1">
                                        <Check className="h-4 w-4 text-green-500" />
                                    </div>
                                    <span className="text-slate-300 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                        {/* Subtle Learning Curve Line */}
                        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                            <div className="h-full w-2/3 bg-cyan-500/50" />
                        </div>
                    </Card>

                    {/* Beat 3: Sui Proof */}
                    <Card className="beat-card absolute w-full max-w-md border-white/10 bg-slate-900/50 p-8 backdrop-blur-md opacity-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">SuiSign</h3>
                                <p className="text-sm text-slate-400 mb-4">(Haulout Hackathon)</p>
                            </div>
                            <Code2 className="h-10 w-10 text-blue-500/50" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Move</Badge>
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Sui Objects</Badge>
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Wallet UX</Badge>
                        </div>
                    </Card>

                    {/* Beat 4: Walrus Native */}
                    <Card className="beat-card absolute w-full max-w-md border-white/10 bg-slate-900/50 p-8 backdrop-blur-md opacity-0">
                        <h3 className="mb-6 text-xl font-bold text-cyan-400">Walrus-Native Upgrade</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Database, text: "Walrus blobs: rich event + ticket payloads" },
                                { icon: Lock, text: "Seal: encrypted access, holder-only reveal" },
                                { icon: Globe, text: "Walrus Sites: verifiable event pages" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-lg bg-black/20 p-3">
                                    <item.icon className="h-5 w-5 text-cyan-400" />
                                    <span className="text-slate-200 text-sm font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-white/10 pt-4 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Next Phase: MVP</p>
                        </div>
                    </Card>

                </div>
            </div>

            {/* Next Indicator */}
            <div className="next-indicator absolute bottom-12 opacity-0">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest animate-pulse">
                    Next: MVP Definition
                </p>
            </div>

        </section>
    )
}
