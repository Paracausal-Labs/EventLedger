"use client"

import { motion } from "framer-motion"
import { usePresenterStore } from "@/store/presenter-store"
import { cn } from "@/lib/utils"
import { Rocket, Sparkles, Globe, BadgeCheck } from "lucide-react"

const PHASES = [
    {
        phase: "Phase 1",
        title: "MVP",
        status: "current",
        icon: Rocket,
        features: [
            "Core registration flow",
            "Ticket NFTs + Attendance NFTs",
            "Walrus Sites for events",
            "zkLogin onboarding"
        ]
    },
    {
        phase: "Phase 2",
        title: "Ecosystem Expansion",
        status: "next",
        icon: Sparkles,
        features: [
            "Multi-track events",
            "Badge printing integration",
            "Sponsor activation tools",
            "Analytics dashboard"
        ]
    },
    {
        phase: "Phase 3",
        title: "Platform Scale",
        status: "future",
        icon: Globe,
        features: [
            "White-label solutions",
            "Cross-chain bridging",
            "DAO governance tooling",
            "Enterprise tier"
        ]
    }
]

export function Evolution() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="evolution" className="py-24 lg:py-32 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="mb-16 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm font-medium uppercase tracking-widest text-primary mb-4 block">
                        Product Evolution
                    </span>
                    <h2 className={cn(
                        "font-bold tracking-tight mb-6",
                        isPresenterMode ? "text-5xl" : "text-4xl"
                    )}>
                        MVP is Just the Start
                    </h2>
                    <p className={cn(
                        "text-muted-foreground",
                        isPresenterMode ? "text-xl" : "text-lg"
                    )}>
                        We're building primitives that compound. Each phase unlocks new use cases.
                    </p>
                </motion.div>

                {/* Phases Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {PHASES.map((phase, i) => (
                        <motion.div
                            key={i}
                            className={cn(
                                "relative rounded-2xl border p-6 md:p-8 transition-colors",
                                phase.status === "current"
                                    ? "border-primary/50 bg-primary/5"
                                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                            )}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {/* Status Badge */}
                            {phase.status === "current" && (
                                <div className="absolute -top-3 left-6 flex items-center gap-1.5 bg-primary px-3 py-1 rounded-full">
                                    <BadgeCheck className="h-3.5 w-3.5 text-black" />
                                    <span className="text-xs font-bold text-black uppercase">Grant Scope</span>
                                </div>
                            )}

                            {/* Icon */}
                            <div className={cn(
                                "mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl",
                                phase.status === "current"
                                    ? "bg-primary/20 text-primary"
                                    : "bg-white/5 text-muted-foreground"
                            )}>
                                <phase.icon className="h-6 w-6" />
                            </div>

                            {/* Title */}
                            <div className="mb-6">
                                <span className={cn(
                                    "text-sm font-medium uppercase tracking-wider",
                                    phase.status === "current" ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {phase.phase}
                                </span>
                                <h3 className={cn(
                                    "mt-1 font-bold text-white",
                                    isPresenterMode ? "text-2xl" : "text-xl"
                                )}>
                                    {phase.title}
                                </h3>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3">
                                {phase.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-full shrink-0",
                                            phase.status === "current" ? "bg-primary" : "bg-white/30"
                                        )} />
                                        <span className={cn(
                                            phase.status === "current" ? "text-gray-200" : "text-muted-foreground",
                                            isPresenterMode ? "text-lg" : "text-base"
                                        )}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Key Takeaway */}
                <motion.div
                    className="mt-12 p-6 rounded-xl border border-cyan-500/20 bg-cyan-950/10 max-w-3xl"
                    initial={{ opacity: 0, y: 10 }}
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
                                Grant covers Phase 1 only. Clear scope, measurable outcomes, expandable foundation.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
