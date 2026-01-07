import { PitchControls } from "@/components/sections/pitch-controls"
import { Hero } from "@/components/sections/hero"
import { ProblemSolution } from "@/components/sections/problem-solution"
import { MVPWrapper } from "@/components/sections/mvp-checklist"
import { Architecture } from "@/components/sections/architecture"
import { EnsureProof } from "@/components/sections/ensure-proof"
import { Timeline } from "@/components/sections/timeline"
import { Ecosystem } from "@/components/sections/ecosystem"
import { Risks } from "@/components/sections/risks"
import { Close } from "@/components/sections/close"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <PitchControls />
      <Hero />
      <ProblemSolution />
      <MVPWrapper />
      <Architecture />
      <EnsureProof />
      <Timeline />
      <Ecosystem />
      <Risks />
      <Close />
    </main>
  )
}
