"use client"

import React, { useRef, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Database, FileCode2, Globe, Key, Lock, Network, Scan, Users } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

// --- DATA STRUCTURES ---

type Step = {
    id: string
    title: string
    rfpMatch?: string
    diagramFocus: string[] // IDs of nodes/edges to highlight
    chips: string[]
    principles: string[]
    dataObjects: { label: string; fields: string }[]
    isExtension?: boolean
}

const STEPS: Step[] = [
    {
        id: "step1",
        title: "Event Creation & Metadata",
        rfpMatch: "RFP: Public Metadata",
        diagramFocus: ["node-org", "node-walrus-meta", "edge-1"],
        chips: [
            "Event metadata stored on Walrus (title/time/image)",
            "Flexible params: price, capacity, visibility",
            "Optional approval flow & ICS calendar support"
        ],
        principles: ["Minimal Access Control", "Decentralized Storage"],
        dataObjects: [{ label: "Event Object", fields: "id, organizer, metadata_blob_id, params" }]
    },
    {
        id: "step2",
        title: "Walrus Sites (Event Page)",
        rfpMatch: "RFP: Decentralized Hosting",
        diagramFocus: ["node-walrus-meta", "node-site", "edge-2"],
        chips: [
            "Event page hosted directly as a Walrus Site",
            "Agenda, speakers, announcements, media",
            "Verifiable + portable event content (no servers)"
        ],
        principles: ["Censorship Resistance", "Portable UI"],
        dataObjects: [{ label: "Site Resource", fields: "site_id, blob_id, dns_record" }]
    },
    {
        id: "step3",
        title: "Registration (zkLogin)",
        rfpMatch: "RFP: On-chain Identity",
        diagramFocus: ["node-user", "node-zk", "node-move-reg", "edge-3"],
        chips: [
            "Register with zkLogin identity (Google/Twitch)",
            "Verifiable confirmation on success",
            "Hooks for email/wallet notifications"
        ],
        principles: ["Low Friction", "Sybil Resistance"],
        dataObjects: [{ label: "Attendee Registry", fields: "user_address, event_id, status" }]
    },
    {
        id: "step4",
        title: "NFT Ticketing + Encryption",
        rfpMatch: "RFP: Validatable Tickets",
        diagramFocus: ["node-move-mint", "node-walrus-ticket", "node-seal", "edge-4"],
        chips: [
            "Ticket NFT minted on Sui",
            "Ticket blob contains encrypted payload (QR, location)",
            "Encrypted via Seal; only holder can decrypt"
        ],
        principles: ["Privacy by Default", "Ownership"],
        dataObjects: [
            { label: "Ticket NFT", fields: "id, owner, event_id, encrypted_blob_id" }
        ]
    },
    {
        id: "step5",
        title: "Event Access & Validation",
        rfpMatch: "RFP: Gate Access",
        diagramFocus: ["node-ticket-holder", "node-site-gate", "edge-5"],
        chips: [
            "Ticket holders unlock Walrus Site content",
            "QR or wallet-based entry validation",
            "At-venue scanning support included"
        ],
        principles: ["Token Gated Access"],
        dataObjects: []
    },
    {
        id: "step6",
        title: "Attendance Verification",
        rfpMatch: "RFP: Proof of Attendance",
        diagramFocus: ["node-scanner", "node-move-att", "edge-6"],
        chips: [
            "Scan confirms attendance on-chain",
            "Attendance NFT minted (Soulbound optional)",
            "Reusable for airdrops, loyalty, and reputation"
        ],
        principles: ["Composable Reputation"],
        dataObjects: [{ label: "Attendance NFT", fields: "id, event_id, attendee, timestamp" }]
    },
    {
        id: "step7",
        title: "Post-event Interaction",
        rfpMatch: "RFP: Data Availability",
        diagramFocus: ["node-walrus-archive", "node-export", "edge-7"],
        chips: [
            "Event data remains verifiable on Walrus",
            "Organizer export: analytics & sales reports",
            "User can revoke Walrus access (Right to be forgotten)"
        ],
        principles: ["Long-term Availability"],
        dataObjects: []
    },
    // --- EXTENSIONS ---
    {
        id: "ext1",
        title: "Ext A: Participation Hub",
        isExtension: true,
        diagramFocus: ["node-hub", "edge-ext1"],
        chips: [
            "POAPs exist, but are usually scattered",
            "EventLedger unifies Event Page + Attendance + Proofs",
            "Single canonical record per event"
        ],
        principles: ["Unified UX"],
        dataObjects: [{ label: "Hub Indexer", fields: "user_id, [event_ids], [proofs]" }]
    },
    {
        id: "ext2",
        title: "Ext B: Judging & Escrow",
        isExtension: true,
        diagramFocus: ["node-judging", "node-escrow", "edge-ext2"],
        chips: [
            "Prizes often change at disbursal -> solve via escrow",
            "Judges submit decisions on-chain",
            "Transparent winner selection + automatic payouts"
        ],
        principles: ["Trustless Payouts"],
        dataObjects: [
            { label: "Escrow Obj", fields: "balance, release_conditions" },
            { label: "Judging Obj", fields: "rubric, judges, votes" }
        ]
    },
    {
        id: "ext3",
        title: "Ext C: Reusable Profiles",
        isExtension: true,
        diagramFocus: ["node-profile", "edge-ext3"],
        chips: [
            "Reusable profile for event applications",
            "Auto-fill standard fields from previous events",
            "Base reputation score derived from participation"
        ],
        principles: ["Sovereign Data"],
        dataObjects: [{ label: "Profile", fields: "id, zk_sub, reputation_score" }]
    }
]


// --- COMPONENTS ---

export function ArchitectureFlowSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 1024px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=4000", // Long scroll distance for steps
                    pin: true,
                    scrub: 0.5,
                    onUpdate: (self) => {
                        const p = self.progress
                        setProgress(p)
                        // Map progress to steps
                        const idx = Math.min(
                            Math.floor(p * STEPS.length),
                            STEPS.length - 1
                        )
                        setCurrentStepIndex(idx)
                    }
                }
            })
        })
    }, { scope: containerRef })

    const currentStep = STEPS[currentStepIndex]

    return (
        <section ref={containerRef} id="architecture" className="relative w-full bg-[#0B0F12] text-white overflow-hidden min-h-screen border-t border-white/5">

            {/* Progress Bar (Top) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-50">
                <motion.div
                    className="h-full bg-cyan-500"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            <div className="container h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pt-20 pb-8 relative z-10">

                {/* LEFT: SVG DIAGRAM */}
                <div className="lg:col-span-7 h-[50vh] lg:h-[80vh] flex items-center justify-center relative rounded-xl border border-white/5 bg-[#0F1318]/50 overflow-hidden">
                    <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
                        System Architecture v1.0
                    </div>

                    <SystemDiagram activeHighlights={currentStep.diagramFocus} />
                </div>

                {/* RIGHT: INFO PANEL */}
                <div className="lg:col-span-5 flex flex-col justify-center h-full pointer-events-none">
                    <div className="pointer-events-auto space-y-8 p-6 lg:p-10">

                        {/* Header */}
                        <div>
                            {currentStep.isExtension && (
                                <Badge variant="outline" className="mb-2 border-purple-500/50 text-purple-400 animate-pulse">
                                    Phase 2+ Extension
                                </Badge>
                            )}
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                                {currentStep.title}
                            </h2>
                            {currentStep.rfpMatch && (
                                <Badge className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/20">
                                    {currentStep.rfpMatch}
                                </Badge>
                            )}
                        </div>

                        {/* Chips / Content */}
                        <div className="space-y-3 min-h-[120px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col gap-3"
                                >
                                    {currentStep.chips.map((chip, i) => (
                                        <div key={i} className="flex items-start gap-3 text-lg text-slate-300">
                                            <CheckCircle2 className="h-5 w-5 text-cyan-500 mt-1 shrink-0" />
                                            <span>{chip}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Principles & Data Objects */}
                        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/10">

                            {/* Principles */}
                            <div>
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                    <Lock className="h-3 w-3" /> Design Principles
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    <AnimatePresence mode="popLayout">
                                        {currentStep.principles.map((p) => (
                                            <motion.div
                                                key={p}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-400"
                                            >
                                                {p}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Data Objects */}
                            <div>
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                    <Database className="h-3 w-3" /> Data Objects (Move)
                                </h4>
                                <div className="space-y-2">
                                    <AnimatePresence mode="popLayout">
                                        {currentStep.dataObjects.map((obj) => (
                                            <motion.div
                                                key={obj.label}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono"
                                            >
                                                <div className="text-cyan-400 font-bold mb-1">{obj.label}</div>
                                                <div className="text-slate-500 break-words leading-relaxed">
                                                    struct &#123; <span className="text-slate-400">{obj.fields}</span> &#125;
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}


// --- SVG DIAGRAM COMPONENT ---

function SystemDiagram({ activeHighlights }: { activeHighlights: string[] }) {

    // Helper to check if active
    const isActive = (id: string) => activeHighlights.includes(id)
    const getStroke = (id: string) => isActive(id) ? "#06b6d4" : "#334155"
    const getFill = (id: string) => isActive(id) ? "#06b6d4" : "transparent"
    const getOpacity = (id: string) => isActive(id) ? 1 : 0.3

    return (
        <svg viewBox="0 0 800 600" className="w-full h-full max-w-4xl mx-auto drop-shadow-2xl">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                </marker>
                <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
                </marker>
            </defs>

            {/* --- ZONES --- */}
            {/* Walrus Zone */}
            <rect x="50" y="50" width="300" height="200" rx="10" fill="none" stroke={isActive("node-walrus-meta") ? "#06b6d4" : "#475569"} strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
            <text x="70" y="80" fill="#94a3b8" fontSize="12" fontWeight="bold">WALRUS STORAGE</text>

            {/* Sui Move Zone */}
            <rect x="450" y="50" width="300" height="200" rx="10" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
            <text x="470" y="80" fill="#94a3b8" fontSize="12" fontWeight="bold">SUI BLOCKCHAIN</text>

            {/* --- NODES --- */}

            {/* Org */}
            <DiagramNode id="node-org" x={100} y={150} label="Organizer UI" icon={Users} active={isActive("node-org")} />

            {/* Walrus Meta */}
            <DiagramNode id="node-walrus-meta" x={250} y={150} label="Metadata Blob" icon={Database} active={isActive("node-walrus-meta")} />

            {/* Walrus Site */}
            <DiagramNode id="node-site" x={250} y={280} label="Event Page (Site)" icon={Globe} active={isActive("node-site")} />

            {/* User */}
            <DiagramNode id="node-user" x={100} y={350} label="Attendee" icon={Users} active={isActive("node-user")} />

            {/* zkLogin */}
            <DiagramNode id="node-zk" x={250} y={350} label="zkLogin" icon={Key} active={isActive("node-zk")} />

            {/* Move Registry */}
            <DiagramNode id="node-move-reg" x={500} y={350} label="Registry Contract" icon={FileCode2} active={isActive("node-move-reg")} />

            {/* Move Mint */}
            <DiagramNode id="node-move-mint" x={650} y={350} label="Ticket Mint" icon={FileCode2} active={isActive("node-move-mint")} />

            {/* Walrus Ticket Blob */}
            <DiagramNode id="node-walrus-ticket" x={650} y={150} label="Encrypted Blob" icon={Lock} active={isActive("node-walrus-ticket")} />

            {/* Seal */}
            <DiagramNode id="node-seal" x={500} y={150} label="Seal Encryption" icon={Lock} active={isActive("node-seal")} />


            {/* Ticket Holder */}
            <DiagramNode id="node-ticket-holder" x={100} y={450} label="Ticket Holder" icon={Users} active={isActive("node-ticket-holder")} />

            {/* Site Gate */}
            <DiagramNode id="node-site-gate" x={250} y={450} label="Gated Access" icon={Lock} active={isActive("node-site-gate")} />

            {/* Scanner */}
            <DiagramNode id="node-scanner" x={400} y={520} label="Scanner App" icon={Scan} active={isActive("node-scanner")} />

            {/* Move Attendance */}
            <DiagramNode id="node-move-att" x={600} y={520} label="Attendance NFT" icon={FileCode2} active={isActive("node-move-att")} />

            {/* Walrus Archive */}
            <DiagramNode id="node-walrus-archive" x={350} y={100} label="Archive" icon={Database} active={isActive("node-walrus-archive")} />
            <DiagramNode id="node-export" x={200} y={50} label="Export" icon={FileCode2} active={isActive("node-export")} />


            {/* --- EDGES --- */}
            {/* 1. Org -> Meta */}
            <DiagramEdge id="edge-1" d="M 130 150 L 220 150" active={isActive("edge-1")} />

            {/* 2. Meta -> Site */}
            <DiagramEdge id="edge-2" d="M 250 180 L 250 250" active={isActive("edge-2")} />

            {/* 3. User -> zk -> Move */}
            <DiagramEdge id="edge-3" d="M 130 350 L 220 350 M 280 350 L 470 350" active={isActive("edge-3")} />

            {/* 4. Mint -> Blob + Seal */}
            <DiagramEdge id="edge-4" d="M 650 320 L 650 180 M 620 150 L 530 150" active={isActive("edge-4")} />

            {/* 5. Holder -> Gate */}
            <DiagramEdge id="edge-5" d="M 130 450 L 220 450" active={isActive("edge-5")} />

            {/* 6. Scanner -> Attendance */}
            <DiagramEdge id="edge-6" d="M 430 520 L 570 520" active={isActive("edge-6")} />

            {/* Post event */}
            <DiagramEdge id="edge-7" d="M 280 150 L 320 100" active={isActive("edge-7")} />


            {/* EXTENSIONS (Fade in if active) */}
            <g style={{ opacity: isActive("edge-ext1") || isActive("edge-ext2") || isActive("edge-ext3") ? 1 : 0.1, transition: "opacity 0.5s" }}>
                <DiagramNode id="node-hub" x={400} y={580} label="Participation Hub" icon={Network} active={isActive("node-hub")} />
                <DiagramNode id="node-judging" x={700} y={450} label="Judging" icon={FileCode2} active={isActive("node-judging")} />
                <DiagramNode id="node-escrow" x={700} y={550} label="Escrow" icon={Lock} active={isActive("node-escrow")} />
                <DiagramNode id="node-profile" x={100} y={550} label="Profile" icon={Users} active={isActive("node-profile")} />

                {/* Edges */}
                <DiagramEdge id="edge-ext1" d="M 600 550 L 430 580" active={isActive("edge-ext1")} />
                <DiagramEdge id="edge-ext2" d="M 680 520 L 700 480" active={isActive("edge-ext2")} />
                <DiagramEdge id="edge-ext3" d="M 130 380 L 100 520" active={isActive("edge-ext3")} />
            </g>


        </svg>
    )
}

function DiagramNode({ id, x, y, label, icon: Icon, active }: { id: string, x: number, y: number, label: string, icon: any, active: boolean }) {
    return (
        <g
            id={id}
            transform={`translate(${x}, ${y})`}
            style={{ transition: "all 0.5s ease" }}
            opacity={active ? 1 : 0.4}
        >
            <circle r="30" fill={active ? "#06b6d4" : "#1e293b"} stroke={active ? "#22d3ee" : "#334155"} strokeWidth="2">
                {active && <animate attributeName="fill-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
            </circle>
            <foreignObject x="-12" y="-12" width="24" height="24">
                <Icon className={cn("h-6 w-6", active ? "text-white" : "text-slate-500")} />
            </foreignObject>
            <text y="45" textAnchor="middle" fill={active ? "#ffffff" : "#64748b"} fontSize="10" fontWeight="bold">
                {label}
            </text>
        </g>
    )
}

function DiagramEdge({ id, d, active }: { id: string, d: string, active: boolean }) {
    return (
        <g>
            <path
                d={d}
                stroke={active ? "#06b6d4" : "#334155"}
                strokeWidth={active ? "3" : "1"}
                fill="none"
                markerEnd={active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                style={{ transition: "all 0.5s ease" }}
            />
            {active && (
                <circle r="4" fill="#fff">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path={d} />
                </circle>
            )}
        </g>
    )
}
