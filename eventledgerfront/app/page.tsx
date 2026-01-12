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
            <ClosingNextStepsQuestionsSection />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
