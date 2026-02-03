"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    CheckCircle2,
    ArrowRight,
    MessageSquare,
    Calendar,
    ShieldCheck,
    Layers,
    Box,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePresenterStore } from "@/store/presenter-store"

const NEXT_STEPS = [
    "Confirm MVP scope alignment with Walrus team",
    "Lock reporting cadence + pilot event support",
    "Start Phase 1 implementation immediately"
]

const CHIPS = [
    { label: "MVP Scope", id: "mvp-evolution" },
    { label: "Seal + Walrus Flow", id: "adoption-globe" }, // Best fit for Walrus integration
    { label: "Timeline & Budget", id: "timeline" },
]

const NAV_LINKS = [
    { label: "MVP Definition", id: "mvp-evolution", icon: Box },
    { label: "Architecture", id: "architecture", icon: Layers },
    { label: "Walrus Integration", id: "adoption-globe", icon: Box },
    { label: "Timeline & Budget", id: "timeline", icon: Calendar },
    { label: "Risks & Mitigations", id: "risks", icon: ShieldCheck },
    { label: "GTM / Adoption", id: "adoption-globe", icon: ArrowRight }, // Using same section for GTM
]

export function ClosingNextStepsQuestionsSection() {
    const { isPresenterMode } = usePresenterStore()
    const [showNav, setShowNav] = useState(false)

    // Smooth scroll handler
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            setShowNav(false)
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <section className="relative w-full bg-[#0B0F12] py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10 px-4">

                {/* --- ANCHOR STATEMENT --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-400">Status: Ready</Badge>
                    <h2 className={cn("font-bold text-white mb-4", isPresenterMode ? "text-5xl" : "text-4xl")}>Ready to Ship</h2>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        "We are ready to ship the Walrus reference implementation for event registration and ticketing — clean primitives, real usage, great UX."
                    </p>
                </motion.div>

                {/* --- SPLIT LAYOUT --- */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">

                    {/* LEFT CARD: NEXT STEPS */}
                    <Card className="bg-slate-900/50 border-white/10 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />

                        <h3 className="text-2xl font-bold text-white mb-1">Next Steps</h3>
                        <p className="text-xs font-mono text-emerald-400 mb-8 uppercase tracking-widest">(Immediately after grant approval)</p>

                        <div className="space-y-6 relative z-10">
                            {NEXT_STEPS.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 + 0.3 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    </div>
                                    <span className={cn("text-slate-300", isPresenterMode ? "text-lg" : "text-base")}>{step}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="mt-8 pt-6 border-t border-white/5"
                        >
                            <p className="text-sm text-slate-500 italic">"Ride the Walrus. Build the future."</p>
                        </motion.div>

                        {/* Subtle Progress Bar */}
                        <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50"
                        />
                    </Card>

                    {/* RIGHT CARD: OPEN FOR QUESTIONS */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-white/10 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        {/* Typing Dots Animation */}
                        {!isPresenterMode && (
                            <div className="absolute top-8 right-8 flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="relative z-10">
                            <h3 className={cn("font-bold text-white mb-2", isPresenterMode ? "text-4xl" : "text-3xl")}>Open for Questions</h3>
                            <p className="text-slate-400 mb-8 max-w-sm mx-auto">"Happy to go deeper on architecture, scope, or timelines."</p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {CHIPS.map((chip, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.5 }}
                                        whileHover={{ y: -2, borderColor: "rgba(6,182,212,0.5)" }}
                                        onClick={() => scrollToSection(chip.id)}
                                        className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 transition-colors"
                                    >
                                        {chip.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </Card>

                </div>

                {/* --- BOTTOM CTA --- */}
                <div className="text-center">
                    <Button
                        size="lg"
                        className="bg-white text-black hover:bg-cyan-500 hover:text-white transition-all text-lg h-14 px-8 rounded-full font-bold"
                        onClick={() => setShowNav(true)}
                    >
                        Ask a Question <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>

            </div>

            {/* --- JUMP TO SECTION MODAL --- */}
            <AnimatePresence>
                {showNav && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setShowNav(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#0B0F12] border border-white/10 rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Jump to Section</h3>
                                <button onClick={() => setShowNav(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="grid gap-2">
                                {NAV_LINKS.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => scrollToSection(link.id)}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left"
                                    >
                                        <div className="p-2 rounded-lg bg-slate-900 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors">
                                            <link.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-slate-300 group-hover:text-white font-medium">{link.label}</span>
                                        <ArrowRight className="ml-auto w-4 h-4 text-slate-600 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    )
}
