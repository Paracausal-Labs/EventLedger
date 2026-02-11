"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, ShieldCheck, Database, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WALRUS_ASCII } from "@/lib/ascii"
import { usePresenterStore } from "@/store/presenter-store"
import { cn } from "@/lib/utils"


import { FloatingWalrusScene } from "@/components/3d/floating-walrus-scene"

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
        <section id="hero" className="relative flex min-h-[90vh] flex-col overflow-hidden pt-4">
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
                    <span className="text-3xl md:text-5xl font-mono text-cyan-400 font-bold tracking-widest uppercase mb-4 block">
                        Walrus First
                    </span>

                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                        Walrus-Native Event Protocol
                    </div>

                    <div className="relative mb-8 select-none mx-auto lg:mx-0 w-fit">
                        <motion.pre
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-[0.4rem] leading-[0.4rem] md:text-[6px] md:leading-[6px] lg:text-[10px] lg:leading-[10px] text-white/80 font-bold whitespace-pre block"
                        >
                            {WALRUS_ASCII}
                        </motion.pre>

                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -bottom-4 right-0 text-cyan-400 font-mono text-xs md:text-sm font-bold tracking-widest"
                        >
                            v1.0.0
                        </motion.span>
                    </div>

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
                            asChild
                        >
                            <a href="/technical">
                                View Technical Architecture
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </motion.div>

                {/* Visual - Background Video Replacement */}
                <motion.div
                    className="relative hidden lg:flex h-[600px] w-full items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <FloatingWalrusScene />
                </motion.div>
            </div>
        </section>
    )
}
