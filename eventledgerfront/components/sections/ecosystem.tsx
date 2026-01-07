"use client"

import { usePresenterStore } from "@/store/presenter-store"
import { motion } from "framer-motion"
import { Users, Tent, Sparkles } from "lucide-react"

const AUDIENCES = [
    {
        title: "Organizers",
        icon: Tent,
        desc: "Universities, Hackathons, Ecosystem Events",
        benefit: "Verifiable attendance stats + no data silos."
    },
    {
        title: "Attendees",
        icon: Users,
        desc: "Developers, Students, Community",
        benefit: "True ticket ownership + private reputation."
    },
    {
        title: "Ecosystem Teams",
        icon: Sparkles,
        desc: "Projects looking for growth",
        benefit: "Targeted airdrops via attendance NFTs."
    }
]

export function Ecosystem() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="ecosystem" className="container py-24 lg:py-32">
            <div className="relative mb-20 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 px-6 py-12 text-center border border-white/10">
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">North Star</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-200">
                    "Default event layer for Sui + Walrus: when an event is announced, EventLedger is the expected link."
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {AUDIENCES.map((audience, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.05]"
                    >
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <audience.icon className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">{audience.title}</h3>
                        <div className="text-sm font-medium text-primary">{audience.desc}</div>
                        <p className="mt-4 text-muted-foreground">{audience.benefit}</p>
                    </motion.div>
                ))}
            </div>

            {/* Metrics Metrics Placeholder */}
            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-16 md:grid-cols-4">
                {[
                    { label: "Target Events", value: "25+" },
                    { label: "Registrations", value: "5,000+" },
                    { label: "Walrus Blobs", value: "10k+" },
                    { label: "Cost / Ticket", value: "<$0.01" },
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-3xl font-bold tracking-tighter text-white">{stat.value}</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}
