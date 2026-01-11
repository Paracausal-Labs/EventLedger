"use client"

import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Check, X, XCircle, Database, Lock, Globe, FileStack } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePresenterStore } from "@/store/presenter-store"

gsap.registerPlugin(ScrollTrigger)

type Feature = {
    label: string
    value: boolean
}

type Competitor = {
    id: string
    name: string
    tagline: string
    description: string
    features: Feature[]
    color: string
}

const COMPETITORS: Competitor[] = [
    {
        id: "luma",
        name: "Luma",
        tagline: "Great Web2 onboarding",
        description: "Centralized data, standard visuals",
        color: "bg-slate-950/90 border-white/10",
        features: [
            { label: "Easy Registration", value: true },
            { label: "Beautiful Pages", value: true },
            { label: "On-Chain Identity", value: false },
            { label: "Verifiable Tickets", value: false },
            { label: "Programmable Assets", value: false },
        ]
    },
    {
        id: "eventbrite",
        name: "Eventbrite",
        tagline: "Payments + Scale",
        description: "Still data siloed, high fees",
        color: "bg-slate-950/90 border-orange-500/20",
        features: [
            { label: "Massive scale", value: true },
            { label: "Payment Processing", value: true },
            { label: "On-Chain Identity", value: false },
            { label: "Verifiable Tickets", value: false },
            { label: "Programmable Assets", value: false },
        ]
    },
    {
        id: "eventledger",
        name: "EventLedger",
        tagline: "Walrus-native + Sui-native",
        description: "Verifiable, encrypted, composable",
        color: "bg-cyan-950/90 border-cyan-500/50",
        features: [
            { label: "Easy Registration", value: true },
            { label: "Beautiful Pages", value: true },
            { label: "On-Chain Identity", value: true },
            { label: "Verifiable Tickets", value: true },
            { label: "Programmable Assets", value: true },
        ]
    }
]

export function ComparisonShuffleSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)
    const { isPresenterMode } = usePresenterStore()

    useGSAP(() => {
        const mm = gsap.matchMedia()
        const cards = gsap.utils.toArray<HTMLElement>(".competitor-card")

        // Presenter mode adjustment
        const durationScale = isPresenterMode ? 1.5 : 1

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=2000", // Pin distance
                    pin: true,
                    scrub: 1,
                    // markers: true, // Debug
                }
            })

            // Initial State: 
            // Luma (0) Center
            // Eventbrite (1) & EventLedger (2) Hidden/Back Right
            gsap.set(cards[0], { x: 0, scale: 1, rotation: 0, opacity: 1, zIndex: 30 })
            gsap.set(cards[1], { x: 100, scale: 0.9, rotation: 10, opacity: 0, zIndex: 20 })
            gsap.set(cards[2], { x: 100, scale: 0.9, rotation: 10, opacity: 0, zIndex: 10 })

            // Initial Left Content & Glow State
            gsap.set(".solution-content", { autoAlpha: 0, y: 20 })
            gsap.set(".problem-content", { autoAlpha: 1, y: 0 })
            gsap.set(".glow-blob", { backgroundColor: "rgba(248, 113, 113, 0.15)" }) // Red tint

            // --- Step 1: Luma moves to "Discard" (Left/Back), Eventbrite Enters ---
            tl
                // Luma Moves Left/Back
                .to(cards[0], {
                    x: -50,
                    scale: 0.9,
                    rotation: -5,
                    opacity: 0.5,
                    zIndex: 20, // Drop below incoming
                    duration: 1 * durationScale
                }, "luma")
                // Eventbrite Enters
                .to(cards[1], {
                    x: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 30, // On Top
                    duration: 1 * durationScale
                }, "luma")

                // --- Step 2: Eventbrite moves to "Discard", EventLedger Enters ---
                // Luma pushes further back
                .to(cards[0], {
                    x: -40, // Slightly overlap
                    y: -15, // Offset
                    rotation: -10,
                    scale: 0.85,
                    zIndex: 10,
                    opacity: 0.3,
                    duration: 1 * durationScale
                }, "eventbrite")
                // Eventbrite moves Left/Back
                .to(cards[1], {
                    x: 0, // Align with Luma's prev spot roughly
                    scale: 0.9,
                    rotation: -5,
                    opacity: 0.5,
                    zIndex: 20,
                    duration: 1 * durationScale
                }, "eventbrite")
                // EventLedger Enters
                .to(cards[2], {
                    x: 20, // Slight offset right for clear view
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    zIndex: 30,
                    duration: 1 * durationScale
                }, "eventbrite")

                // --- Step 3: EventLedger Wins (Enlarge) & Glow Change ---
                .to(cards[2], {
                    scale: 1.1,
                    x: 0, // Center it
                    boxShadow: "0 0 100px -20px rgba(6, 182, 212, 0.4)",
                    borderColor: "rgba(6, 182, 212, 0.8)",
                    duration: 1 * durationScale
                }, "enlarge")

                // Swap Content: Hide Problem, Show Solution
                .to(".problem-content", {
                    autoAlpha: 0,
                    y: -20,
                    duration: 0.5 * durationScale
                }, "enlarge")
                .to(".solution-content", {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5 * durationScale
                }, "enlarge")

                // Glow Shift: Red -> Cyan
                .to(".glow-blob", {
                    backgroundColor: "rgba(6, 182, 212, 0.2)",
                    scale: 1.2,
                    duration: 1 * durationScale
                }, "enlarge")

                // Dim background
                .to(".comparison-bg", {
                    opacity: 0.9,
                    duration: 1 * durationScale
                }, "enlarge")

        })

    }, { scope: containerRef, dependencies: [isPresenterMode] })

    return (
        <section ref={containerRef} className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0B0F12] py-24">

            {/* Background Element for dimming */}
            <div className="comparison-bg absolute inset-0 bg-[#0B0F12] opacity-0 transition-opacity" />

            {/* Dynamic Glow Blob */}
            <div className="glow-blob absolute left-0 top-1/2 h-[500px] w-[500px] -translate-x-1/4 -translate-y-1/2 rounded-full blur-[120px] transition-colors" />

            <div className="container relative z-10 mx-auto grid h-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">

                {/* Left Column: Headlines (Dynamic) */}
                <div className="flex flex-col justify-center relative min-h-[400px]">

                    {/* Problem Content (Visible for Web2) */}
                    <div className="problem-content absolute inset-0 flex flex-col justify-center">
                        <h2 className={cn(
                            "mb-8 font-bold leading-tight tracking-tighter text-red-400",
                            isPresenterMode ? "text-5xl" : "text-4xl"
                        )}>
                            Web2 Event Tools <br />
                            Break Composability
                        </h2>
                        <ul className="space-y-6">
                            {[
                                "Email-based identity (siloed)",
                                "Centralized ticket control (rent-seeking)",
                                "Private data leaks / no encrypted ownership",
                                "Attendance not verifiable / not reusable"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <XCircle className="mt-1 h-6 w-6 shrink-0 text-red-500/50" />
                                    <span className={cn("text-slate-300", isPresenterMode ? "text-xl" : "text-lg")}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Solution Content (Visible for EventLedger) */}
                    <div className="solution-content absolute inset-0 flex flex-col justify-center opacity-0">
                        <h2 className={cn(
                            "mb-8 font-bold leading-tight tracking-tighter text-cyan-400",
                            isPresenterMode ? "text-5xl" : "text-4xl"
                        )}>
                            Walrus + Sui <br />
                            Fixes This
                        </h2>

                        <div className="grid gap-8">
                            {[
                                { icon: Database, title: "Walrus Blobs", desc: "Rich event/ticket data without bloating chain state" },
                                { icon: Lock, title: "Seal Encryption", desc: "Encrypted ticket payloads (only holder can decrypt)" },
                                { icon: Globe, title: "Walrus Sites", desc: "Verifiable event pages + content (censorship resistant)" },
                                { icon: FileStack, title: "Sui Objects", desc: "Dynamic NFTs for tickets + attendance proofs" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1 rounded-lg bg-cyan-950/30 p-2">
                                        <item.icon className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className={cn("font-medium text-white", isPresenterMode ? "text-xl" : "text-lg")}>{item.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Card Stack */}
                <div ref={cardsRef} className="relative flex items-center justify-center h-[500px]">
                    {COMPETITORS.map((comp) => (
                        <Card
                            key={comp.id}
                            className={cn(
                                "competitor-card absolute h-[520px] w-[380px] border border-white/10 p-8 backdrop-blur-md transition-shadow will-change-transform",
                                comp.color
                            )}
                        >
                            <div className="mb-6">
                                <h3 className="text-3xl font-bold text-white">{comp.name}</h3>
                                <p className="text-base font-medium text-slate-400">{comp.tagline}</p>
                            </div>

                            <Separator className="mb-6 bg-white/10" />

                            <div className="space-y-4">
                                {comp.features.map((feat, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-base text-slate-300">{feat.label}</span>
                                        {feat.value ? (
                                            <Check className="h-5 w-5 text-cyan-400" />
                                        ) : (
                                            <X className="h-5 w-5 text-red-500/50" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {comp.id === "eventledger" && (
                                <div className="mt-8 flex gap-2">
                                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">Walrus-native</Badge>
                                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">Sui</Badge>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
