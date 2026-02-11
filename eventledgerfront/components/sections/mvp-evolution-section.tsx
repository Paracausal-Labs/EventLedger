"use client"

import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
    Plus, Lock, ArrowUpRight,
    Calendar, Globe, UserCheck, Ticket,
    CreditCard, QrCode, Award, Download,
    Network, Share2, Database
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePresenterStore } from "@/store/presenter-store"

gsap.registerPlugin(ScrollTrigger)

const MVP_MODULES = [
    { id: "create", label: "Event Creation", desc: "Metadata stored on Walrus", icon: Calendar },
    { id: "site", label: "Walrus Site Publishing", desc: "Verifiable event page", icon: Globe },
    { id: "auth", label: "zkLogin Registration", desc: "Web2 onboarding → Sui identity", icon: UserCheck },
    { id: "nft", label: "Ticket NFT", desc: "Linked to Encrypted Blob", icon: Ticket },
    { id: "pay", label: "Payments (Optional)", desc: "Paid tickets supported", icon: CreditCard },
    { id: "checkin", label: "Check-In", desc: "QR / wallet validation", icon: QrCode },
    { id: "poap", label: "Attendance NFT", desc: "Proof of presence", icon: Award },
    { id: "export", label: "Organizer Export", desc: "Anonymized attendance data", icon: Download },
]

const LOCKED_MODULES = [
    { label: "Multi-track events" },
    { label: "Sponsor activations" },
    { label: "Badge printing" },
    { label: "Deep CRM + chat" },
]

const FUTURE_NODES = [
    { label: "Event reputation graph", icon: Network },
    { label: "Cross-app eligibility", icon: Share2 },
    { label: "Walrus event standard", icon: Database },
]

export function MVPEvolutionSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { isPresenterMode } = usePresenterStore()

    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3000", // Pin distance
                    pin: true,
                    scrub: 1,
                }
            })

            const modules = gsap.utils.toArray<HTMLElement>(".mvp-module")

            // --- ACT 1: MVP ASSEMBLY ---
            // Initial state: Hidden
            gsap.set(modules, { autoAlpha: 0, scale: 0.8, y: 20 })
            gsap.set(".phase1-complete", { autoAlpha: 0, scale: 0.9 })

            // Staggered entry of MVP modules
            tl.to(modules, {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                stagger: 0.1,
                duration: 2
            })
                .to(".phase1-complete", { autoAlpha: 1, scale: 1, duration: 0.5 })


                // --- ACT 2: SCOPE DISCIPLINE ---
                // Dim main grid slightly & Hide Phase 1 Badge
                .to(".mvp-grid", { opacity: 0.3, scale: 0.95, duration: 1 }, "+=0.5")
                .to(".phase1-complete", { autoAlpha: 0, duration: 0.5 }, "<")

                // Show Locked Overlay
                .fromTo(".locked-overlay",
                    { autoAlpha: 0, y: 50 },
                    { autoAlpha: 1, y: 0, duration: 1 }
                    , "<")


                // --- ACT 3: FUTURE EVOLUTION ---
                // Hide locked overlay
                .to(".locked-overlay", { autoAlpha: 0, y: 20, duration: 0.5 }, "+=2.5")

                // Move MVP Grid to center/core position & brighten
                .to(".mvp-grid", { opacity: 1, scale: 0.7, y: -100, duration: 1 })

                // Expand Future Lines & Nodes
                .fromTo(".future-lines", { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 1 }, "<")
                .fromTo(".future-node",
                    { autoAlpha: 0, y: 20 },
                    { autoAlpha: 1, y: 0, stagger: 0.2, duration: 1 },
                    "<+=0.5")

                // Final Caption
                .fromTo(".final-caption", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, "-=0.5")

                // Hold
                .to({}, { duration: 1 })

        })

    }, { scope: containerRef, dependencies: [isPresenterMode] })

    return (
        <section ref={containerRef} id="mvp" className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0B0F12] py-24 overflow-hidden">

            {/* Status Header */}
            <div className="absolute top-12 left-0 w-full text-center z-10">
                <h2 className={cn("font-bold text-white", isPresenterMode ? "text-4xl" : "text-3xl")}>
                    MVP Definition
                </h2>
                <p className="text-slate-500 mt-2">Shipped in Phase 1</p>
            </div>

            <div className="container relative mx-auto flex h-full items-center justify-center">

                {/* Main System Frame */}
                <div className="relative w-full max-w-5xl h-[700px] flex items-center justify-center">

                    {/* MVP Grid */}
                    <div className="mvp-grid grid grid-cols-2 md:grid-cols-4 gap-4 w-full z-20 transition-all will-change-transform translate-y-20">
                        {MVP_MODULES.map((mod) => (
                            <Card key={mod.id} className="mvp-module flex flex-col items-center justify-center p-6 bg-slate-900/40 border-white/10 backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
                                <div className="mb-4 rounded-full bg-cyan-500/10 p-3 text-cyan-400">
                                    <mod.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-white text-center mb-1">{mod.label}</h3>
                                <p className="text-xs text-slate-400 text-center leading-tight">{mod.desc}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Phase 1 Complete Label (Centered overlaid on grid initially) */}
                    <div className="phase1-complete absolute inset-0 flex items-center justify-center pointer-events-none z-30 translate-y-20">
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-6 py-2 text-lg backdrop-blur-md">
                            Phase 1 Complete
                        </Badge>
                    </div>

                    {/* Locked Overlay (Bottom) */}
                    <div className="locked-overlay absolute bottom-1/4 left-0 w-full z-40 opacity-0 pointer-events-none">
                        <div className="mx-auto max-w-3xl rounded-xl border border-red-500/20 bg-red-950/20 p-6 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm">Not in MVP (Phase 2+)</h3>
                                <Lock className="h-4 w-4 text-red-500" />
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {LOCKED_MODULES.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 opacity-60">
                                        <span className="text-red-400/50 line-through text-sm">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-red-300/50 mt-4 italic">
                                "Intentionally excluded to ship a clean, reliable v1."
                            </p>
                        </div>
                    </div>

                    {/* Future Evolution Container (Behind Grid) */}
                    <div className="future-lines absolute inset-0 z-10 opacity-0 pointer-events-none flex items-center justify-center">
                        {/* Connecting Lines SVG */}
                        <svg className="absolute w-[120%] h-[120%] overflow-visible">
                            {/* Lines from Center (approx top 40%) to Bottom Nodes */}
                            <line x1="50%" y1="40%" x2="20%" y2="80%" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="50%" y1="40%" x2="80%" y2="80%" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="50%" y1="40%" x2="50%" y2="85%" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                        </svg>

                        {/* Future Nodes - Positioned absolute relative to container */}
                        <div className="absolute bottom-[10%] left-[5%] md:left-[10%] future-node">
                            <Card className="bg-blue-950/20 border-blue-500/30 p-4 w-48 backdrop-blur-md">
                                <Network className="h-5 w-5 text-blue-400 mb-2" />
                                <p className="text-blue-200 text-sm font-semibold">Reputation Graph</p>
                            </Card>
                        </div>
                        <div className="absolute bottom-0 md:bottom-[5%] future-node">
                            <Card className="bg-blue-950/20 border-blue-500/30 p-4 w-48 backdrop-blur-md">
                                <Database className="h-5 w-5 text-blue-400 mb-2" />
                                <p className="text-blue-200 text-sm font-semibold">Walrus Standard</p>
                            </Card>
                        </div>
                        <div className="absolute bottom-[10%] right-[5%] md:right-[10%] future-node">
                            <Card className="bg-blue-950/20 border-blue-500/30 p-4 w-48 backdrop-blur-md">
                                <Share2 className="h-5 w-5 text-blue-400 mb-2" />
                                <p className="text-blue-200 text-sm font-semibold">Cross-app Gating</p>
                            </Card>
                        </div>

                    </div>

                </div>

            </div>

            {/* Final Caption */}
            <div className="final-caption absolute bottom-12 opacity-0 text-center">
                <p className={cn("text-slate-400 font-light", isPresenterMode ? "text-2xl" : "text-xl")}>
                    "The MVP is the foundation - not a dead end."
                </p>
            </div>

        </section>
    )
}
