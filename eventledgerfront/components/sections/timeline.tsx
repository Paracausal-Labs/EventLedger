"use client"

import { usePresenterStore } from "@/store/presenter-store"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const PHASES = [
    {
        title: "Phase 1: Walrus + Seal Integration Spike + Schemas",
        budget: "$8,000",
        deliverables: ["Ticket schema definition", "Walrus storage adapter", "Seal encryption prototype", "Basic connect wallet"],
        success: "Can store/retrieve encrypted ticket details from Walrus"
    },
    {
        title: "Phase 2: Core Move Contracts",
        budget: "$8,000",
        deliverables: ["EventRegistry contract", "TicketNFT contract (mint/transfer)", "AttendanceNFT contract", "Access control rules"],
        success: "End-to-end on-chain flow works on Testnet"
    },
    {
        title: "Phase 3: Frontend + Walrus Sites + Scanner",
        budget: "$6,000",
        deliverables: ["Organizer Dashboard UI", "Attendee Registration UI", "QR Code Scanner (PWA)", "Walrus Site generator"],
        success: "Non-technical user can create event and verify ticket"
    },
    {
        title: "Phase 4: Pilots + Docs + GTM",
        budget: "$3,000",
        deliverables: ["Developer Documentation", "Pilot Event Runbook", "Public Launch", "Video Walkthrough"],
        success: "Live pilot executed with real users"
    }
]

export function Timeline() {
    const { isPresenterMode } = usePresenterStore()

    return (
        <section id="timeline" className="container py-24 lg:py-32">
            <div className="mx-auto max-w-4xl">
                <h2 className="mb-12 text-center text-4xl font-bold tracking-tight">Timeline & Milestones</h2>

                <div className="rounded-xl border border-white/10 bg-white/[0.02]">
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {PHASES.map((phase, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-b-white/10 px-6">
                                <AccordionTrigger className={cn("hover:no-underline", isPresenterMode && "py-6")}>
                                    <div className="flex w-full items-center justify-between pr-4">
                                        <span className={cn("font-medium", isPresenterMode ? "text-xl" : "text-lg")}>{phase.title}</span>
                                        <span className="font-mono text-sm text-primary">{phase.budget}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6">
                                    <div className="grid gap-6 pl-4 sm:grid-cols-2">
                                        <div>
                                            <div className="mb-2 text-xs uppercase text-muted-foreground">Deliverables</div>
                                            <ul className="list-disc space-y-1 pl-4 text-sm text-gray-300">
                                                {phase.deliverables.map((d, j) => (
                                                    <li key={j}>{d}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className="mb-2 text-xs uppercase text-muted-foreground">Success Criteria</div>
                                            <p className="text-sm text-gray-300">{phase.success}</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="flex justify-between border-t border-white/10 bg-white/5 px-6 py-4">
                        <span className="font-bold text-white">Total Ask</span>
                        <span className="font-mono font-bold text-primary">$25,000</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
