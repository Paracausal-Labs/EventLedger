"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Close() {
    return (
        <section id="close" className="container pb-32 pt-24">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-6 text-3xl font-bold tracking-tight">Ready to Ship</h2>
                <p className="mb-10 text-xl text-muted-foreground">
                    We want to ship the Walrus reference implementation for event registration and ticketing - clean primitives + great UX.
                </p>

                <div className="mb-12 rounded-xl border border-white/10 bg-white/[0.02] p-8 text-left">
                    <h3 className="mb-4 text-sm font-semibold uppercase text-primary">Next Steps</h3>
                    <ul className="space-y-3">
                        {[
                            "Confirm MVP alignment with Walrus team",
                            "Confirm reporting cadence + pilot support",
                            "Start Phase 1 immediately after grant confirmation"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-xs text-muted-foreground">
                                    {i + 1}
                                </div>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-left">
                        <label className="text-xs text-muted-foreground">Contact</label>
                        <div className="font-medium">Walrus RFP Team</div>
                    </div>
                    <Button className="h-full w-full text-lg" size="lg">
                        Approve Grant
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
