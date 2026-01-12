"use client"

import React, { useRef, useMemo } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { motion } from "framer-motion"
import {
    MapPin, Users, Globe as GlobeIcon, Database, Lock,
    Share2, Network, Milestone, ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePresenterStore } from "@/store/presenter-store"
import { Globe } from "@/components/3d/globe"

gsap.registerPlugin(ScrollTrigger)

// --- GLOBE COMPONENTS ---

// --- 3D WALRUS COMPONENT REMOVED (Moved to Hero) ---


// --- CONTENT DATA ---

const CHAPTERS = [
    {
        id: "c1",
        label: "Beachhead",
        headline: "Start where adoption is natural: campuses + hackathons.",
        subline: "We can drive usage immediately with the events we already control.",
        cards: [
            { icon: Users, text: "Colleges: fests, club events" },
            { icon: MapPin, text: "Hackathons: registrations, check-in" },
            { icon: Network, text: "Student communities: recurring meetups" }
        ],
        gtm: ["Run 10-15 campus events", "Run 3-5 hackathons", "Collect organizer feedback loops weekly"]
    },
    {
        id: "c2",
        label: "Ecosystem Wedge",
        headline: "Expand to ecosystem events that need verifiable attendance.",
        subline: "Sui-native communities, grants rounds, and conferences want composable proofs.",
        cards: [
            { icon: Network, text: "Ecosystem meetups (chapters, builders)" },
            { icon: Milestone, text: "Grants rounds (eligibility + reputation)" },
            { icon: GlobeIcon, text: "Conferences / side-events (proof)" }
        ],
        gtm: ["Events onboarded -> Increasing", "Cross-pollination of data"]
    },
    {
        id: "c3",
        label: "Walrus Value",
        headline: "Walrus isn't storage 'we added' - it's what makes tickets real.",
        subline: "Without Walrus + Seal, you can't safely ship private ticket payloads.",
        cards: [
            { icon: Database, text: "Walrus Blobs: Rich event metadata" },
            { icon: Lock, text: "Seal Encryption: Private ticket payloads" },
            { icon: GlobeIcon, text: "Walrus Sites: Verifiable event pages" }
        ],
        callout: "Location links, QR payloads, agenda updates - all need controlled access."
    },
    {
        id: "c4",
        label: "Global Standard",
        headline: "North Star: default event layer for Sui + Walrus - and beyond.",
        subline: "When an event is announced, EventLedger is the expected link.",
        cards: [
            { icon: Database, text: "Schemas (event, ticket, attendance)" },
            { icon: Share2, text: "Indexers (ecosystem apps consume proofs)" },
            { icon: Network, text: "Integrations (airdrops, gated communities)" }
        ],
        final: "Global event data, verifiable and encrypted."
    }
]

const METRICS = [
    { label: "Target Events", value: "25+" },
    { label: "Registrations", value: "5,000+" },
    { label: "Walrus Blobs", value: "10k+" },
    { label: "Low Cost", value: "Eco-friendly" }
]


export function AdoptionGTMGlobeSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { isPresenterMode } = usePresenterStore()

    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3000",
                    pin: true,
                    scrub: 1,
                }
            })

            const chapters = gsap.utils.toArray<HTMLElement>(".chapter-content")

            // Initial State: Hide all except first
            chapters.forEach((el, i) => {
                if (i !== 0) gsap.set(el, { autoAlpha: 0, x: 50 })
            })

            // Ensure metrics are hidden initially (even if they have class opacity-0, gsap ensures control)
            gsap.set(".metrics-grid", { autoAlpha: 0, y: 20 })

            // --- ANIMATION SEQUENCE ---

            // C1 -> C2
            tl.to(chapters[0], { autoAlpha: 0, x: -50, duration: 1 })
                .to(chapters[1], { autoAlpha: 1, x: 0, duration: 1 })

                // C2 -> C3
                .to(chapters[1], { autoAlpha: 0, x: -50, duration: 1 }, "+=0.5")
                .to(chapters[2], { autoAlpha: 1, x: 0, duration: 1 })

                // C3 -> C4
                .to(chapters[2], { autoAlpha: 0, x: -50, duration: 1 }, "+=0.5")
                .to(chapters[3], { autoAlpha: 1, x: 0, duration: 1 })

                // C4 Metrics Appear
                .to(".metrics-grid", { autoAlpha: 1, y: 0, duration: 1 }, "+=0.2")

                // Progress Bar Logic (Simulated)
                .to(".progress-bar-fill", { height: "100%", duration: tl.duration(), ease: "none" }, 0)

        })

    }, { scope: containerRef, dependencies: [isPresenterMode] })

    return (
        <section id="adoption-globe" ref={containerRef} className="relative flex min-h-screen w-full bg-[#0B0F12] overflow-hidden">

            {/* BACKGROUND GLOBE - RIGHT SIDE (Mobile: Hidden/Subtle) */}
            <div className="absolute inset-0 md:left-1/3 z-0 opacity-40 md:opacity-100 pointer-events-none">
                <Globe />
            </div>

            {/* CONTENT CONTAINER */}
            <div className="container relative z-10 mx-auto grid h-full grid-cols-1 md:grid-cols-12 gap-8 items-center py-20 pointer-events-none"> {/* pointer-events-none to let scroll pass, enable on interactive elements */}

                {/* LEFT COLUMN: Narrative */}
                <div className="md:col-span-5 flex flex-col justify-center h-full relative pointer-events-auto pl-4">

                    {/* Progress Rail */}
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white/10 rounded-full overflow-hidden hidden md:block">
                        <div className="progress-bar-fill w-full bg-cyan-500 h-0" />
                    </div>

                    <div className="relative h-[600px] w-full">
                        {CHAPTERS.map((chapter, i) => (
                            <div key={chapter.id} className={cn("chapter-content absolute top-0 left-0 w-full flex flex-col gap-6", i === 0 ? "opacity-100" : "opacity-0")}>

                                {/* Header */}
                                <div>
                                    <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">Chapter {i + 1} / 4: {chapter.label}</Badge>
                                    <h2 className={cn("font-bold text-white leading-tight mb-2", isPresenterMode ? "text-4xl" : "text-3xl")}>
                                        {chapter.headline}
                                    </h2>
                                    <p className="text-slate-400 text-lg">{chapter.subline}</p>
                                </div>

                                {/* Cards Stack */}
                                <div className="grid gap-3">
                                    {chapter.cards.map((card, idx) => (
                                        <Card key={idx} className="flex items-center gap-3 p-4 bg-slate-900/60 border-white/5 backdrop-blur-md">
                                            <div className="rounded-full bg-cyan-500/10 p-2 =text-cyan-400">
                                                <card.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-200">{card.text}</span>
                                        </Card>
                                    ))}
                                </div>

                                {/* Extras */}
                                {chapter.gtm && (
                                    <div className="mt-2 space-y-2">
                                        {chapter.gtm.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                                                <ArrowRight className="h-3 w-3" />
                                                <span className="uppercase tracking-wide">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {chapter.callout && (
                                    <div className="mt-2 rounded-lg border-l-2 border-cyan-500 bg-cyan-950/20 p-3">
                                        <p className="text-xs text-cyan-200 italic">{chapter.callout}</p>
                                    </div>
                                )}

                                {chapter.final && (
                                    <div className="mt-2">
                                        <p className="text-xl font-light text-white border-l-4 border-white pl-4">{chapter.final}</p>
                                    </div>
                                )}

                                {/* METRICS (Appears at End of Chapter 4) */}
                                {i === 3 && (
                                    <div className="metrics-grid mt-4 w-full grid grid-cols-2 gap-2 opacity-0 pointer-events-none">
                                        {METRICS.map((m, idx) => (
                                            <div key={idx} className="flex flex-col justify-end">
                                                <p className="text-2xl font-bold tracking-tighter text-white leading-none mb-1">{m.value}</p>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </section>
    )
}
