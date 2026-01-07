"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, ShieldCheck, Database, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePresenterStore } from "@/store/presenter-store"
import { cn } from "@/lib/utils"

export function Hero() {
    const { isPresenterMode } = usePresenterStore()

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 80,
                behavior: "smooth",
            })
        }
    }

    return (
        <section id="hero" className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden pt-16">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute right-0 top-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            <div className="container relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
                {/* Content */}
                <motion.div
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                        Walrus-Native Event Protocol
                    </div>

                    <h1 className={cn(
                        "font-bold tracking-tighter text-white",
                        isPresenterMode ? "text-6xl lg:text-8xl" : "text-5xl lg:text-7xl"
                    )}>
                        EventLedger
                    </h1>

                    <p className={cn(
                        "text-muted-foreground",
                        isPresenterMode ? "text-2xl leading-relaxed" : "text-xl leading-relaxed"
                    )}>
                        Walrus-native event registration, ticketing, and attendance on <span className="text-foreground font-medium">Sui</span>.
                    </p>

                    <ul className="flex flex-col gap-3">
                        {[
                            { text: "zkLogin onboarding → real Sui identity", icon: ShieldCheck },
                            { text: "NFT tickets backed by Seal-encrypted Walrus blobs", icon: Database },
                            { text: "Attendance NFTs for proof-of-presence + rewards", icon: Ticket },
                        ].map((item, i) => (
                            <motion.li
                                key={i}
                                className="flex items-center gap-3 text-lg text-gray-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                            >
                                <item.icon className="h-5 w-5 text-primary" />
                                {item.text}
                            </motion.li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button
                            size={isPresenterMode ? "lg" : "default"}
                            className={cn("gap-2", isPresenterMode && "h-14 px-8 text-lg")}
                            onClick={() => scrollToSection("mvp")}
                        >
                            See MVP in 90 seconds
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size={isPresenterMode ? "lg" : "default"}
                            className={cn(isPresenterMode && "h-14 px-8 text-lg")}
                            onClick={() => scrollToSection("architecture")}
                        >
                            View Architecture
                        </Button>
                    </div>
                </motion.div>

                {/* Visual - Abstract Dot Map / Diagram */}
                <motion.div
                    className="relative hidden lg:block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative aspect-square w-full rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm">
                        {/* Simple SVG Diagram Placeholder */}
                        <svg viewBox="0 0 400 400" className="h-full w-full stroke-primary/50" fill="none">
                            <circle cx="200" cy="200" r="100" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" />
                            <circle cx="200" cy="200" r="150" strokeWidth="1" strokeOpacity="0.2" />
                            <circle cx="200" cy="200" r="50" className="fill-primary/10 stroke-primary" />

                            {/* Nodes */}
                            <circle cx="200" cy="100" r="4" className="fill-white" />
                            <circle cx="300" cy="200" r="4" className="fill-white" />
                            <circle cx="200" cy="300" r="4" className="fill-white" />
                            <circle cx="100" cy="200" r="4" className="fill-white" />

                            {/* Connecting lines */}
                            <path d="M200 150 L200 100" strokeOpacity="0.5" />
                            <path d="M250 200 L300 200" strokeOpacity="0.5" />
                            <path d="M200 250 L200 300" strokeOpacity="0.5" />
                            <path d="M150 200 L100 200" strokeOpacity="0.5" />
                        </svg>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-xs font-mono uppercase text-primary mb-1">Blob Storage</div>
                                <div className="text-2xl font-bold tracking-tight">WALRUS</div>
                            </div>
                        </div>

                        {/* Floating cards */}
                        <motion.div
                            className="absolute top-10 right-10 rounded-lg border border-white/10 bg-black/60 p-4 backdrop-blur-md"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="text-xs text-muted-foreground">Encrypted via Seal</div>
                            <div className="font-mono text-sm text-white">TicketPayload.blob</div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-20 left-10 rounded-lg border border-white/10 bg-black/60 p-4 backdrop-blur-md"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <div className="text-xs text-muted-foreground">On-Chain Asset</div>
                            <div className="font-mono text-sm text-white">Sui::EventNFT</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
