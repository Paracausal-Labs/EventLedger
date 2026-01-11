"use client"

import React, { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Clock, ArrowRight, Wallet, Code2, ShieldCheck, Globe as GlobeIcon, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { usePresenterStore } from "@/store/presenter-store"

gsap.registerPlugin(ScrollTrigger)

// --- DATA ---
const PHASES = [
    {
        id: "p1",
        title: "Phase 1: Walrus + Seal Integration",
        budget: 8000,
        timeline: "Weeks 1-3",
        icon: Code2,
        deliverables: ["Ticket schema definition", "Walrus storage adapter", "Seal encryption prototype"],
        success: "Store/retrieve encrypted ticket details from Walrus"
    },
    {
        id: "p2",
        title: "Phase 2: Core Move Contracts",
        budget: 8000,
        timeline: "Weeks 4-6",
        icon: ShieldCheck,
        deliverables: ["EventRegistry contract", "TicketNFT (mint/transfer)", "AttendanceNFT contract", "Access controls"],
        success: "End-to-end on-chain flow works on Testnet"
    },
    {
        id: "p3",
        title: "Phase 3: Frontend + Sites",
        budget: 6000,
        timeline: "Weeks 7-9",
        icon: GlobeIcon,
        deliverables: ["Organizer Dashboard UI", "Attendee Registration UI", "QR Code Scanner (PWA)", "Walrus Site generator"],
        success: "Non-technical user can create event & verify ticket"
    },
    {
        id: "p4",
        title: "Phase 4: Pilots & GTM",
        budget: 3000,
        timeline: "Weeks 10-12",
        icon: Users,
        deliverables: ["Developer Documentation", "Pilot Event Runbook", "Public Launch", "Video Walkthrough"],
        success: "Live pilot executed with real users"
    }
]

export function TimelineMilestonesScroll() {
    const containerRef = useRef<HTMLDivElement>(null)
    const railRef = useRef<HTMLDivElement>(null)
    const { isPresenterMode } = usePresenterStore()
    const [activePhaseIndex, setActivePhaseIndex] = useState(0)
    const [currentTotal, setCurrentTotal] = useState(0)

    // PRESENTER MODE: View All Toggle
    const [viewAll, setViewAll] = useState(false)

    useGSAP(() => {
        if (viewAll) return // Disable scroll logic if View All is on

        const totalBudget = 25000
        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3000",
                    pin: true,
                    scrub: 0.5,
                    onUpdate: (self) => {
                        // Calculate active phase based on progress
                        const p = self.progress
                        const index = Math.min(Math.floor(p * 4), 3)
                        setActivePhaseIndex(index)

                        // Animate generic counter based on progress
                        setCurrentTotal(Math.floor(p * totalBudget))
                    }
                }
            })

            // Rail Fill Animation
            tl.to(".rail-progress", { height: "100%", ease: "none" })

            // Note: Card expansion logic is handled by React state (activePhaseIndex) 
            // driven by the ScrollTrigger callback for smoother UI updates than layout thrashing via GSAP directly.
        })

        // Mobile simple cleanup/fallback handled by CSS logic mostly

    }, { scope: containerRef, dependencies: [viewAll] })

    return (
        <section id="timeline" ref={containerRef} className={cn("relative min-h-screen w-full bg-[#0B0F12] py-24", viewAll ? "h-auto" : "h-screen overflow-hidden")}>
            <div className="container mx-auto h-full grid grid-cols-1 md:grid-cols-12 gap-12">

                {/* --- LEFT COLUMN: STICKY INFO --- */}
                <div className="md:col-span-4 flex flex-col h-full relative z-10">
                    <div className="mb-12">
                        <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">Roadmap</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Timeline &<br />Milestones</h2>
                        <p className="text-slate-400 text-lg">4 phases, outcome-first execution.</p>

                        {/* Total Ask Counter */}
                        <div className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
                            <p className="text-sm font-uppercase text-slate-500 tracking-wider mb-1">TOTAL ASK</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-mono text-cyan-400 font-bold">
                                    ${viewAll ? "25,000" : currentTotal.toLocaleString()}
                                </span>
                                <span className="text-slate-500">/ $25,000</span>
                            </div>
                        </div>

                        {/* Presenter Toggle */}
                        {isPresenterMode && (
                            <button
                                onClick={() => setViewAll(!viewAll)}
                                className="mt-4 text-xs text-slate-500 hover:text-white underline transition-colors"
                            >
                                {viewAll ? "Switch to Scroll Mode" : "View All Phases"}
                            </button>
                        )}
                    </div>

                    {/* Desktop Rail (Visual Only - logic driven by separate rail-progress) */}
                    <div className="flex-1 relative hidden md:block pl-2">
                        {/* Background Track */}
                        <div className="absolute top-0 bottom-12 left-[11px] w-[2px] bg-slate-800" />
                        {/* Active Track */}
                        <div className="rail-progress absolute top-0 left-[11px] w-[2px] bg-cyan-500 h-0 transition-none" />

                        <div className="flex flex-col justify-between h-[80%]">
                            {PHASES.map((phase, i) => (
                                <div key={i} className={cn("relative flex items-center gap-4 transition-all duration-300",
                                    i <= activePhaseIndex ? "opacity-100" : "opacity-30"
                                )}>
                                    <div className={cn("z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[#0B0F12] transition-colors",
                                        i <= activePhaseIndex ? "border-cyan-500 scale-110" : "border-slate-700"
                                    )}>
                                        {i < activePhaseIndex ? <CheckCircle2 className="w-3 h-3 text-cyan-500" /> : <Circle className="w-2 h-2 fill-current" />}
                                    </div>
                                    <span className={cn("font-mono text-sm", i === activePhaseIndex ? "text-cyan-400" : "text-slate-500")}>
                                        Phase {i + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: SCROLLING CARDS --- */}
                <div className="md:col-span-8 flex flex-col justify-center gap-4 relative">
                    {PHASES.map((phase, i) => {
                        const isActive = i === activePhaseIndex || viewAll
                        const isPast = i < activePhaseIndex && !viewAll

                        return (
                            <motion.div
                                key={phase.id}
                                layout
                                initial={{ opacity: 0.5, scale: 0.95 }}
                                animate={{
                                    opacity: isActive ? 1 : 0.4,
                                    scale: isActive ? 1 : 0.98,
                                    height: isActive ? "auto" : "80px" // Collapsed state
                                }}
                                transition={{ duration: 0.4, type: "spring" }}
                                className={cn("w-full overflow-hidden rounded-xl border transition-colors relative",
                                    isActive ? "border-cyan-500/50 bg-slate-900/80" : "border-white/5 bg-slate-900/30",
                                    !isActive && "cursor-pointer hover:border-white/10"
                                )}
                                onClick={() => !viewAll && setActivePhaseIndex(i)} // Allow manual click to expand if wanted
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("p-3 rounded-lg", isActive ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-500")}>
                                                <phase.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={cn("font-bold text-xl leading-none", isActive ? "text-white" : "text-slate-400")}>{phase.title}</h3>
                                                <p className="font-mono text-sm text-slate-500 mt-1">{phase.timeline}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("text-2xl font-mono font-bold", isActive ? "text-white" : "text-slate-600")}>${phase.budget.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* EXPANDABLE CONTENT */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5"
                                            >
                                                <div>
                                                    <p className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-wider">Deliverables</p>
                                                    <ul className="space-y-2">
                                                        {phase.deliverables.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                                                <ArrowRight className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-wider">Success Criteria</p>
                                                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 text-sm">
                                                        {phase.success}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
