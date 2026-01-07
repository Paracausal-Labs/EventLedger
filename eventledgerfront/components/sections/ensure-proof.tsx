"use client"

import { usePresenterStore } from "@/store/presenter-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function EnsureProof() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="ensure" className="container py-24 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                    <h2 className="mb-6 text-3xl font-bold">Execution Proof: ENSure</h2>
                    <p className={cn("mb-8 text-muted-foreground", isPresenterMode ? "text-xl" : "text-lg")}>
                        We’ve built a close cousin of this already (ENSure) — events + identity + contracts — now rebuilding it Walrus-native.
                    </p>

                    <ul className="space-y-4">
                        {[
                            "Executed under pressure at major hackathons",
                            "Token-gated registration & identity verification",
                            "Complex smart contract integration with smooth UX"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/50">
                    {/* Placeholder for Screenshot */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div className="rounded-full bg-white/10 p-4">
                            <svg className="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground uppercase tracking-wider">ENSure Dashboard Screenshot</p>
                        <div className="mt-2 text-xs text-white/30">(Drop image here later)</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
