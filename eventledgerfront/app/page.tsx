"use client"

import { useState } from "react"
import { PitchControls } from "@/components/sections/pitch-controls"
import { Hero } from "@/components/sections/hero"
import { Architecture } from "@/components/sections/architecture"
import { Timeline } from "@/components/sections/timeline"
import { Ecosystem } from "@/components/sections/ecosystem"
import { Risks } from "@/components/sections/risks"
import { Close } from "@/components/sections/close"
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
            <Architecture />
            <Timeline />
            <Ecosystem />
            <Risks />
            <Close />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
