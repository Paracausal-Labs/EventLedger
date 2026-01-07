"use client"

import { usePresenterStore } from "@/store/presenter-store"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, useScroll } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

const MVP_ITEMS = [
    "Organizer creates event (metadata stored on Walrus)",
    "Event published as Walrus Site (agenda/speakers/media)",
    "Attendee registers via zkLogin",
    "Ticket NFT minted on Sui + linked to Seal-encrypted Walrus blob",
    "Optional payment support (paid tickets)",
    "QR/wallet check-in validates ticket ownership",
    "Attendance NFT minted (Soulbound optional)",
    "Organizer export: anonymized attendance + ticket sales report"
]

const PHASE_2_ITEMS = [
    "Multi-track events",
    "Badge printing",
    "Advanced sponsor activations",
    "Deep CRM + chat"
]

export function MVPWrapper() {
    const { isPresenterMode } = usePresenterStore()
    const mlRef = useRef(null)

    return (
        <section id="mvp" className="container py-24 lg:py-32" ref={mlRef}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-background p-8 lg:p-12 shadow-2xl shadow-primary/5">
                    <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">MVP Definition</h2>
                            <p className="mt-2 text-primary">Shipped in Phase 1</p>
                        </div>
                        <div className="hidden lg:block text-right">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Scope</div>
                            <div className="font-mono text-xl text-white">Strict</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {MVP_ITEMS.map((item, i) => (
                            <motion.div
                                key={i}
                                className="flex items-start gap-4 rounded-lg border border-transparent p-3 transition-colors hover:border-white/5 hover:bg-white/[0.02]"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Checkbox checked className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-black" />
                                <span className={cn("text-lg", isPresenterMode ? "text-xl" : "text-gray-300")}>{item}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 rounded-lg border border-dashed border-white/10 bg-white/[0.01] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Not in MVP (Phase 2+)</h3>
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {PHASE_2_ITEMS.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-muted-foreground/60">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-900" />
                                    <span className="line-through decoration-red-900/50">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
