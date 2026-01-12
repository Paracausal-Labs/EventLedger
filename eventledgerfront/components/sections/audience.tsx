"use client"

import { usePresenterStore } from "@/store/presenter-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Building2, GraduationCap, Sparkles, Users } from "lucide-react"

const AUDIENCES = [
    {
        title: "Crypto-Native Events",
        icon: Sparkles,
        examples: "Hackathons, Conferences, Side-events",
        pain: "Luma/Eventbrite can't verify on-chain identity",
        value: "Attendance NFTs unlock airdrops + reputation"
    },
    {
        title: "Universities & DevRel",
        icon: GraduationCap,
        examples: "Workshops, Bootcamps, Campus Events",
        pain: "Manual attendance tracking, no data portability",
        value: "Verifiable credentials for student builders"
    },
    {
        title: "Ecosystem Teams",
        icon: Building2,
        examples: "Protocol launches, Community calls",
        pain: "Can't target engaged community members",
        value: "NFT-gated drops to proven attendees"
    },
    {
        title: "DAOs & Communities",
        icon: Users,
        examples: "IRL meetups, Governance events",
        pain: "No proof-of-presence for governance weight",
        value: "Soulbound attendance = voting credibility"
    }
]

export function Audience() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="audience" className="py-24 lg:py-32">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="mb-16 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm font-medium uppercase tracking-widest text-primary mb-4 block">
                        Target Audience
                    </span>
                    <h2 className={cn(
                        "font-bold tracking-tight mb-6",
                        isPresenterMode ? "text-5xl" : "text-4xl"
                    )}>
                        Who We're Building For
                    </h2>
                    <p className={cn(
                        "text-muted-foreground",
                        isPresenterMode ? "text-xl" : "text-lg"
                    )}>
                        Four segments with immediate pain. All want verifiable, composable event data.
                    </p>
                </motion.div>

                {/* Audience Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    {AUDIENCES.map((audience, i) => (
                        <motion.div
                            key={i}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 transition-colors hover:bg-white/[0.04] hover:border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="flex items-start gap-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                    <audience.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={cn(
                                        "font-bold text-white mb-1",
                                        isPresenterMode ? "text-xl" : "text-lg"
                                    )}>
                                        {audience.title}
                                    </h3>
                                    <p className="text-sm text-primary font-medium mb-4">
                                        {audience.examples}
                                    </p>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs uppercase text-red-400 font-medium shrink-0 mt-0.5">Pain:</span>
                                            <span className="text-sm text-muted-foreground">{audience.pain}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs uppercase text-cyan-400 font-medium shrink-0 mt-0.5">Value:</span>
                                            <span className="text-sm text-gray-300">{audience.value}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* North Star */}
                <motion.div
                    className="mt-16 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-blue-950/30 to-cyan-950/30 border border-cyan-500/20 p-8 md:p-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-xs uppercase tracking-widest text-cyan-400 font-medium">North Star</span>
                    <p className={cn(
                        "mt-4 text-white font-bold max-w-2xl mx-auto",
                        isPresenterMode ? "text-3xl" : "text-2xl"
                    )}>
                        "When a Sui event is announced, EventLedger is the expected registration link."
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
