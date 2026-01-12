"use client"

import { motion } from "framer-motion"
import { usePresenterStore } from "@/store/presenter-store"
import { cn } from "@/lib/utils"
import { Zap, ArrowRight, Trophy, Code2, Users } from "lucide-react"

const TIMELINE_POINTS = [
    {
        icon: Trophy,
        title: "ETHGlobal New Delhi",
        subtitle: "Nov 2024",
        desc: "Built ENSure under 48h pressure — token-gated registration with ENS identity verification"
    },
    {
        icon: Code2,
        title: "Battle-tested Architecture",
        subtitle: "Identity + Events + Smart Contracts",
        desc: "Learned what works: smooth onboarding, encrypted ticket payloads, verifiable attendance"
    },
    {
        icon: Users,
        title: "User Feedback",
        subtitle: "Real organizers, real pain",
        desc: "Centralized tools fail on data ownership. Users want portable, composable credentials."
    },
    {
        icon: Zap,
        title: "EventLedger",
        subtitle: "Walrus-native rebuild",
        desc: "Same vision, rebuilt from scratch on Walrus + Sui for true decentralization and scale"
    }
]

export function OriginStory() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="origin" className="relative py-24 lg:py-32 overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent" />
            
            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-16 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm font-medium uppercase tracking-widest text-primary mb-4 block">
                        Origin Story
                    </span>
                    <h2 className={cn(
                        "font-bold tracking-tight mb-6",
                        isPresenterMode ? "text-5xl" : "text-4xl"
                    )}>
                        From <span className="text-cyan-400">ENSure</span> to{" "}
                        <span className="text-cyan-400">EventLedger</span>
                    </h2>
                    <p className={cn(
                        "text-muted-foreground",
                        isPresenterMode ? "text-xl" : "text-lg"
                    )}>
                        We didn't just dream this up. We built, shipped, and learned under pressure.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent hidden md:block" />

                    <div className="space-y-8 md:space-y-12">
                        {TIMELINE_POINTS.map((point, i) => (
                            <motion.div
                                key={i}
                                className="relative flex gap-6 md:gap-8"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {/* Icon */}
                                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cyan-950/50 border border-cyan-500/30">
                                    <point.icon className="h-7 w-7 text-cyan-400" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-8 border-b border-white/5 md:border-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className={cn(
                                            "font-bold text-white",
                                            isPresenterMode ? "text-2xl" : "text-xl"
                                        )}>
                                            {point.title}
                                        </h3>
                                        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            {point.subtitle}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-muted-foreground",
                                        isPresenterMode ? "text-lg" : "text-base"
                                    )}>
                                        {point.desc}
                                    </p>
                                </div>

                                {/* Arrow for last item */}
                                {i === TIMELINE_POINTS.length - 1 && (
                                    <ArrowRight className="absolute -right-2 top-6 h-5 w-5 text-cyan-400 hidden lg:block" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Key Takeaway */}
                <motion.div
                    className="mt-16 p-6 md:p-8 rounded-xl border border-cyan-500/20 bg-cyan-950/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-start gap-4">
                        <div className="h-1 w-1 mt-3 rounded-full bg-cyan-400 shrink-0" />
                        <div>
                            <span className="text-xs uppercase tracking-widest text-cyan-400 font-medium">Key Takeaway</span>
                            <p className={cn(
                                "mt-2 text-white font-medium",
                                isPresenterMode ? "text-xl" : "text-lg"
                            )}>
                                EventLedger is not a pivot — it's an evolution. Same team, same vision, better infrastructure.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
