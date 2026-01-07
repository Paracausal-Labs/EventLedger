"use client"

import { usePresenterStore } from "@/store/presenter-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Architecture() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="architecture" className="container py-24 lg:py-32">
            <div className="mb-12">
                <h2 className="text-4xl font-bold tracking-tight">System Architecture</h2>
                <p className="mt-4 text-xl text-muted-foreground">Minimal on-chain footprint. Rich, encrypted off-chain storage.</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
                {/* Diagram Column (Wider) */}
                <div className="lg:col-span-2">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 md:p-12">
                        {/* SVG Architecture Diagram */}
                        <svg viewBox="0 0 800 450" className="h-full w-full font-sans">
                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                                </marker>
                            </defs>

                            {/* Zones */}
                            <rect x="50" y="50" width="200" height="350" rx="8" fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeDasharray="4 4" />
                            <text x="150" y="80" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold">SUI BLOCKCHAIN</text>

                            <rect x="300" y="50" width="200" height="350" rx="8" fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeDasharray="4 4" />
                            <text x="400" y="80" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold">WALRUS (Storage)</text>

                            <rect x="550" y="50" width="200" height="350" rx="8" fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeDasharray="4 4" />
                            <text x="650" y="80" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold">CLIENT / SEAL</text>

                            {/* Boxes SUI */}
                            <g transform="translate(75, 120)">
                                <rect width="150" height="60" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                                <text x="75" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Move Contracts</text>
                                <text x="75" y="45" textAnchor="middle" fill="#06b6d4" fontSize="10">EventRegistry, TicketNFT</text>
                            </g>

                            {/* Boxes Walrus */}
                            <g transform="translate(325, 120)">
                                <rect width="150" height="60" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                                <text x="75" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Public Metadata</text>
                                <text x="75" y="45" textAnchor="middle" fill="#a855f7" fontSize="10">Events JSON, Images</text>
                            </g>

                            <g transform="translate(325, 250)">
                                <rect width="150" height="60" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                                <text x="75" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Encrypted Blobs</text>
                                <text x="75" y="45" textAnchor="middle" fill="#ef4444" fontSize="10">Ticket Payload (PII)</text>
                            </g>

                            {/* Boxes Client */}
                            <g transform="translate(575, 185)">
                                <rect width="150" height="80" rx="4" fill="#0f172a" stroke="white" strokeWidth="2" />
                                <text x="75" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Frontend App</text>
                                <text x="75" y="55" textAnchor="middle" fill="#94a3b8" fontSize="10">zkLogin + Seal SDK</text>
                            </g>

                            {/* Lines */}
                            {/* Client to Sui */}
                            <path d="M575 225 L225 150" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />

                            {/* Client to Walrus Public */}
                            <path d="M575 200 L475 150" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />

                            {/* Client to Walrus Encrypted */}
                            <path d="M575 250 L475 280" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrow)" />
                        </svg>
                    </div>
                </div>

                {/* Text/Principles Column */}
                <div className="flex flex-col justify-center space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Design Principles</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex gap-2">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span>Minimal on-chain state to reduce gas costs</span>
                            </li>
                            <li className="flex gap-2">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                                <span>Encryption at storage layer via Seal (not app layer)</span>
                            </li>
                            <li className="flex gap-2">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500" />
                                <span>Reusable schemas for ecosystem interoperability</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-lg bg-secondary/50 p-6">
                        <h4 className="mb-4 font-mono text-sm text-primary">Data Objects (Move)</h4>
                        <div className="space-y-2 font-mono text-xs text-muted-foreground">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Event</span>
                                <span className="text-blue-400">id, walrus_blob_id, organizer</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Ticket</span>
                                <span className="text-blue-400">id, event_id, encrypted_blob_id</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Attendance</span>
                                <span className="text-blue-400">id, event_id, timestamp</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
