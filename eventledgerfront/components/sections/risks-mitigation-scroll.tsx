"use client"

import React, { useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { motion } from "framer-motion"
import {
    AlertTriangle,
    Lock,
    Maximize2,
    WifiOff,
    ShieldCheck,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { usePresenterStore } from "@/store/presenter-store"

gsap.registerPlugin(ScrollTrigger)

const RISKS = [
    {
        id: "r1",
        title: "zkLogin UX Complexity",
        icon: Lock,
        risk: "Wallet onboarding and social login flows can introduce friction and drop-off.",
        mitigation: [
            "Early integration with zkLogin SDK",
            "Pre-built auth components",
            "Test harness for edge cases (session expiry, retries)"
        ]
    },
    {
        id: "r2",
        title: "Seal Policy + Encrypted Blob Flows",
        icon: ShieldCheck,
        risk: "Incorrect encryption policies or access control flows could block legitimate users.",
        mitigation: [
            "Start with minimal policy surface",
            "Prototype decrypt flows in Phase 1",
            "Fallback UX for failed decrypt attempts"
        ]
    },
    {
        id: "r3",
        title: "Scope Creep",
        icon: Maximize2,
        risk: "Event tooling can easily expand into CRM, chat, sponsors, analytics, etc.",
        mitigation: [
            "Strict MVP boundary enforced",
            "Phase-gated roadmap",
            "Explicit 'Not in MVP' lock list"
        ]
    },
    {
        id: "r4",
        title: "Onsite Scanning Reliability",
        icon: WifiOff,
        risk: "Poor network conditions at venues can break check-in flows.",
        mitigation: [
            "Offline-friendly scanner mode",
            "Local cache of public keys + hashes",
            "Retry-safe transaction patterns"
        ]
    }
]

export function RisksMitigationScroll() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { isPresenterMode } = usePresenterStore()
    const [activeRiskIndex, setActiveRiskIndex] = useState(0)

    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=2500", // 2.5vh or so
                    pin: true,
                    scrub: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        // Update active index based on generic progress for left rail
                        // The actual card animation is controlled by the timeline below
                        const p = self.progress
                        const index = Math.min(Math.floor(p * 4), 3)
                        setActiveRiskIndex(index)
                    }
                }
            })

            const cards = gsap.utils.toArray<HTMLElement>(".risk-card")

            // Set initial states: First card visible, others hidden and pushed down
            cards.forEach((card, i) => {
                if (i !== 0) {
                    gsap.set(card, { autoAlpha: 0, y: 100, scale: 0.95 })
                } else {
                    gsap.set(card, { autoAlpha: 1, y: 0, scale: 1 })
                }
            })

            // Sequence: R1 -> R2 -> R3 -> R4
            // Transitions: Outgoing fades up/out, Incoming fades up/in

            // R1 -> R2
            tl.to(cards[0], { autoAlpha: 0, y: -50, scale: 0.95, duration: 1 })
                .to(cards[1], { autoAlpha: 1, y: 0, scale: 1, duration: 1 }, "<+=0.2") // mild overlap

                // R2 -> R3
                .to(cards[1], { autoAlpha: 0, y: -50, scale: 0.95, duration: 1 })
                .to(cards[2], { autoAlpha: 1, y: 0, scale: 1, duration: 1 }, "<+=0.2")

                // R3 -> R4
                .to(cards[2], { autoAlpha: 0, y: -50, scale: 0.95, duration: 1 })
                .to(cards[3], { autoAlpha: 1, y: 0, scale: 1, duration: 1 }, "<+=0.2")

            // R4 holds for a bit at the end
            tl.to({}, { duration: 0.5 })

        })

    }, { scope: containerRef, dependencies: [isPresenterMode] })

    return (
        <section ref={containerRef} className="relative min-h-screen w-full bg-[#0B0F12] py-24 overflow-hidden">
            <div className="container mx-auto h-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

                {/* --- LEFT COLUMN: STICKY NAV --- */}
                <div className="md:col-span-5 flex flex-col justify-center h-full relative z-10">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Risks &<br />Mitigations</h2>
                        <p className="text-slate-400 text-lg md:max-w-md">Honest assessment of challenges and how we handle them.</p>
                    </div>

                    {/* RISK INDEX RAIL */}
                    <div className="space-y-6 relative pl-4 border-l border-slate-800">
                        {RISKS.map((risk, i) => (
                            <div key={i} className={cn("transition-all duration-300 flex items-center gap-4",
                                i === activeRiskIndex ? "opacity-100 translate-x-2" : "opacity-40"
                            )}>
                                <div className={cn("w-2 h-2 rounded-full", i === activeRiskIndex ? "bg-cyan-500" : "bg-slate-600")} />
                                <span className={cn("text-sm font-medium", i === activeRiskIndex ? "text-cyan-400" : "text-slate-500")}>
                                    {risk.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: ANIMATED CARDS --- */}
                <div className="md:col-span-7 relative h-[500px] w-full flex items-center justify-center">
                    {RISKS.map((risk, i) => (
                        <div
                            key={risk.id}
                            className="risk-card absolute inset-0 w-full flex items-center justify-center"
                        >
                            <Card className={cn("w-full max-w-2xl bg-slate-900 border border-white/5 p-8 md:p-10 shadow-2xl backdrop-blur-sm",
                                isPresenterMode && "border-cyan-500/20"
                            )}>
                                {/* Header: Risk */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <span className="text-xs font-bold text-red-400 tracking-widest uppercase">RISK</span>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                                            <risk.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={cn("font-bold text-white mb-2", isPresenterMode ? "text-2xl" : "text-xl")}>{risk.title}</h3>
                                            <p className={cn("text-slate-400 leading-relaxed", isPresenterMode ? "text-lg" : "text-base")}>
                                                "{risk.risk}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent my-6" />

                                {/* Footer: Mitigation */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">MITIGATION</span>
                                    </div>
                                    <ul className="grid gap-3">
                                        {risk.mitigation.map((m, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                                                <span className={cn(isPresenterMode ? "text-base" : "text-sm")}>{m}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
