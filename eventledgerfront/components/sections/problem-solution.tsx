"use client"

import { motion } from "framer-motion"
import { XCircle, CheckCircle, Database, Lock, Globe, FileStack } from "lucide-react"
import { usePresenterStore } from "@/store/presenter-store"
import { cn } from "@/lib/utils"

export function ProblemSolution() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="problem" className="container py-24 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2">
                {/* Problem Column */}
                <motion.div
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 lg:p-12"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="mb-8 text-3xl font-bold text-red-400">Web2 Event Tools Break Composability</h2>
                    <ul className="space-y-6">
                        {[
                            "Email-based identity (siloed)",
                            "Centralized ticket control (rent-seeking)",
                            "Private data leaks / no encrypted ownership",
                            "Attendance not verifiable / not reusable"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500/50" />
                                <span className={cn("text-muted-foreground", isPresenterMode && "text-lg")}>{item}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Solution Column */}
                <motion.div
                    className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-8 lg:p-12 relative overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <h2 className="mb-8 text-3xl font-bold text-primary">Walrus + Sui Fixes This</h2>

                    <div className="grid gap-6">
                        {[
                            { icon: Database, title: "Walrus Blobs", desc: "Rich event/ticket data without bloating chain state" },
                            { icon: Lock, title: "Seal Encryption", desc: "Encrypted ticket payloads (only holder can decrypt)" },
                            { icon: Globe, title: "Walrus Sites", desc: "Verifiable event pages + content (censorship resistant)" },
                            { icon: FileStack, title: "Sui Objects", desc: "Dynamic NFTs for tickets + attendance proofs" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="mt-1 rounded-lg bg-primary/10 p-2">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className={cn("font-medium text-white", isPresenterMode && "text-lg")}>{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
