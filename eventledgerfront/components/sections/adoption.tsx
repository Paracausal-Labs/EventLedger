"use client"

import { motion } from "framer-motion"
import { usePresenterStore } from "@/store/presenter-store"
import { cn } from "@/lib/utils"
import { Target, Zap, Shield, Coins, ArrowRight } from "lucide-react"

const USPS = [
    {
        icon: Shield,
        title: "True Data Ownership",
        desc: "Attendee data stored encrypted on Walrus. No vendor lock-in. Users control their credentials."
    },
    {
        icon: Zap,
        title: "Sub-cent Ticketing",
        desc: "Walrus storage + Sui gas = tickets under $0.01. 100x cheaper than Eventbrite's fees."
    },
    {
        icon: Coins,
        title: "Composable Credentials",
        desc: "Attendance NFTs plug into airdrops, governance, reputation systems across Sui ecosystem."
    }
]

const GTM_STEPS = [
    { step: "1", title: "Pilot with Sui Foundation events", desc: "Build credibility with flagship usage" },
    { step: "2", title: "Target ETHGlobal + hackathon circuit", desc: "High-visibility, crypto-native organizers" },
    { step: "3", title: "Partner with Luma/Lu.ma power users", desc: "Offer migration tools + better crypto features" },
    { step: "4", title: "Open-source SDK for builders", desc: "Let ecosystem extend and integrate" },
]

export function Adoption() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="adoption" className="py-24 lg:py-32 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="mb-16 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm font-medium uppercase tracking-widest text-primary mb-4 block">
                        Go-to-Market
                    </span>
                    <h2 className={cn(
                        "font-bold tracking-tight mb-6",
                        isPresenterMode ? "text-5xl" : "text-4xl"
                    )}>
                        Adoption Strategy
                    </h2>
                    <p className={cn(
                        "text-muted-foreground",
                        isPresenterMode ? "text-xl" : "text-lg"
                    )}>
                        We're not competing with Luma on features. We're offering what they can't: verifiable, composable, user-owned event data.
                    </p>
                </motion.div>

                {/* USPs */}
                <div className="grid gap-6 md:grid-cols-3 mb-16">
                    {USPS.map((usp, i) => (
                        <motion.div
                            key={i}
                            className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                                <usp.icon className="h-5 w-5" />
                            </div>
                            <h3 className={cn(
                                "font-bold text-white mb-2",
                                isPresenterMode ? "text-xl" : "text-lg"
                            )}>
                                {usp.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {usp.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* GTM Steps */}
                <motion.div
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Target className="h-5 w-5 text-primary" />
                        <h3 className={cn(
                            "font-bold text-white",
                            isPresenterMode ? "text-2xl" : "text-xl"
                        )}>
                            Launch Sequence
                        </h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {GTM_STEPS.map((item, i) => (
                            <motion.div
                                key={i}
                                className="relative"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4 className={cn(
                                            "font-medium text-white mb-1",
                                            isPresenterMode ? "text-lg" : "text-base"
                                        )}>
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                                {i < GTM_STEPS.length - 1 && (
                                    <ArrowRight className="absolute -right-3 top-3 h-4 w-4 text-white/20 hidden lg:block" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Metrics */}
                <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                    {[
                        { value: "25+", label: "Target Events Y1" },
                        { value: "5,000+", label: "Registrations" },
                        { value: "10k+", label: "Walrus Blobs" },
                        { value: "<$0.01", label: "Cost/Ticket" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            className="text-center p-4 rounded-xl border border-white/5"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className={cn(
                                "font-bold text-white tracking-tight",
                                isPresenterMode ? "text-4xl" : "text-3xl"
                            )}>
                                {stat.value}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
