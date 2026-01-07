"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const RISKS = [
    {
        risk: "zkLogin UX Complexity",
        mitigation: "Mitigate with early integration + test harness. Fallback to standard wallet connect for MVP if critical blockers arise."
    },
    {
        risk: "Seal Policy + Encrypted Blob Flows",
        mitigation: "Mitigate with Phase 1 prototypes. Close collaboration with Walrus/Seal team on edge cases."
    },
    {
        risk: "Scope Creep",
        mitigation: "Strict MVP boundary. Move 'nice-to-haves' (badges, multi-track) to Phase 2 immediately."
    },
    {
        risk: "Onsite Scanning Reliability",
        mitigation: "Offline-friendly scanner mode (local cache of public keys/hashes) + retry-safe patterns."
    }
]

export function Risks() {
    return (
        <section id="risks" className="container py-24 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <h2 className="text-3xl font-bold text-red-500">Risks & Mitigations</h2>
                    <p className="mt-4 text-muted-foreground">Honest assessment of challenges and how we handle them.</p>
                </div>

                <div className="lg:col-span-2">
                    <Accordion type="single" collapsible className="w-full">
                        {RISKS.map((item, i) => (
                            <AccordionItem key={i} value={`risk-${i}`} className="border-b-white/10 px-0">
                                <AccordionTrigger className="hover:no-underline">
                                    <span className="text-left font-medium text-lg text-white">{item.risk}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4">
                                    <div className="flex items-start gap-4 rounded-md bg-white/5 p-4 text-gray-300">
                                        <span className="font-bold text-primary uppercase text-xs mt-1">Mitigation</span>
                                        <span>{item.mitigation}</span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
