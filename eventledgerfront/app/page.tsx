"use client"

import { useState } from "react"
import { PitchControls } from "@/components/sections/pitch-controls"
import { Hero } from "@/components/sections/hero"
import { ArchitectureFlowSection } from "@/components/sections/architecture-flow-section"
import { TimelineMilestonesScroll } from "@/components/sections/timeline-milestones-scroll"
import { AdoptionGTMGlobeSection } from "@/components/sections/adoption-gtm-globe"
import { RisksMitigationScroll } from "@/components/sections/risks-mitigation-scroll"
import { ClosingNextStepsQuestionsSection } from "@/components/sections/closing-next-steps-questions-section"
import { CLIIntro } from "@/components/intro/cli-intro"
import { ComparisonShuffleSection } from "@/components/sections/comparison-shuffle"
import { MotivationScrollStory } from "@/components/sections/motivation-scroll-story"
import { MVPEvolutionSection } from "@/components/sections/mvp-evolution-section"
import { AnimatePresence, motion } from "framer-motion"
import { FileCode2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <CLIIntro key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <PitchControls />
            <Hero />
            <ComparisonShuffleSection />
            <MotivationScrollStory />
            <MVPEvolutionSection />
            <ArchitectureFlowSection />
            <AdoptionGTMGlobeSection />
            <TimelineMilestonesScroll />
            <RisksMitigationScroll />

            <section className="relative py-24 overflow-hidden border-t border-border">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
              <div className="container relative mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                    <FileCode2 className="w-4 h-4" />
                    Deep Dive Available
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Technical <span className="text-primary">Architecture</span>
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    13 detailed system diagrams — from Walrus-first event creation to Seal encryption flows, payment lifecycle, and blob expiry handling.
                  </p>
                  <Link
                    href="/technical"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-black font-bold text-lg hover:bg-primary/90 transition-all hover:gap-4"
                  >
                    View Architecture
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </section>

            <ClosingNextStepsQuestionsSection />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
