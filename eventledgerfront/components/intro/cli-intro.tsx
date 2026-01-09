"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WALRUS_ASCII } from "@/lib/ascii"

export function CLIIntro({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0)
    const [typedCommand, setTypedCommand] = useState("")
    const commandToType = "para init EventLedger"

    // Animation Sequence:
    // 0: Initial black screen
    // 1: Prompt appears (dimmed/inactive)
    // 2: Mouse cursor moves in
    // 3: Mouse clicks (scale down)
    // 4: Mouse moves away / fades, Prompt becomes active (caret)
    // 5: Typing starts
    // 6: Typing done, wait for enter
    // 7: Enter pressed (simulated), Results appear
    // 8: Loading lines
    // 9: Transition out

    useEffect(() => {
        // Step 0 -> 1: Prompt appears
        const timer1 = setTimeout(() => setStep(1), 500)
        return () => clearTimeout(timer1)
    }, [])

    useEffect(() => {
        if (step === 1) {
            // Step 1 -> 2: Trigger mouse move (handled by component render)
            const timer = setTimeout(() => setStep(2), 100)
            return () => clearTimeout(timer)
        }
        if (step === 2) {
            // Step 2 -> 3: Mouse click
            const timer = setTimeout(() => setStep(3), 1500) // wait for move
            return () => clearTimeout(timer)
        }
        if (step === 3) {
            // Step 3 -> 4: Click finished, activate
            const timer = setTimeout(() => setStep(4), 200)
            return () => clearTimeout(timer)
        }
        if (step === 4) {
            // Step 4 -> 5: Start typing
            const timer = setTimeout(() => setStep(5), 500)
            return () => clearTimeout(timer)
        }
    }, [step])

    useEffect(() => {
        if (step === 5) {
            let i = 0
            const typeInterval = setInterval(() => {
                if (i < commandToType.length) {
                    setTypedCommand(commandToType.slice(0, i + 1))
                    i++
                } else {
                    clearInterval(typeInterval)
                    setTimeout(() => setStep(6), 300)
                }
            }, 80) // Typing speed
            return () => clearInterval(typeInterval)
        }
    }, [step])

    useEffect(() => {
        if (step === 6) {
            // Wait then "Enter"
            const timer = setTimeout(() => setStep(7), 600)
            return () => clearTimeout(timer)
        }
        if (step === 7) {
            // Show results, then start loading lines
            const timer = setTimeout(() => setStep(8), 500)
            return () => clearTimeout(timer)
        }
    }, [step])

    useEffect(() => {
        if (step === 8) {
            // Allow reading time for ASCII
            const timer = setTimeout(() => {
                onComplete()
            }, 5500)
            return () => clearTimeout(timer)
        }
    }, [step, onComplete])

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background font-mono overflow-hidden p-4 cursor-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
        >
            {/* Skip Button */}
            <motion.button
                onClick={onComplete}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-8 right-8 text-white/50 hover:text-cyan-400 uppercase text-xs tracking-widest z-[60] cursor-pointer pointer-events-auto transition-colors"
            >
                [ Skip Intro ]
            </motion.button>

            {/* Background Grid (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            <div className="w-full max-w-5xl h-full flex flex-col pt-[20vh] relative">

                {/* Terminal Window */}
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 10 }}
                >
                    {/* Prompt Line */}
                    <div className="flex items-center text-xl md:text-3xl font-bold tracking-tight mb-2">
                        <span className="text-cyan-500 mr-3">paracasual.tech:$</span>
                        <span className="text-white">{typedCommand}</span>

                        {/* Blinking Cursor (Caret) */}
                        {(step === 4 || step === 5 || step === 6) && (
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="ml-2 inline-block w-3 h-8 bg-cyan-500"
                            />
                        )}
                    </div>
                </motion.div>

                {/* Execution Output */}
                <AnimatePresence>
                    {step >= 7 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex flex-col items-start w-full overflow-hidden"
                        >
                            {/* ASCII Art + Version Wrapper */}
                            <div className="relative mb-8 select-none mx-auto lg:mx-0 w-fit">
                                <motion.pre
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-[0.4rem] leading-[0.4rem] md:text-[6px] md:leading-[6px] lg:text-[10px] lg:leading-[10px] text-white/80 font-bold whitespace-pre block"
                                >
                                    {WALRUS_ASCII}
                                </motion.pre>

                                {/* Version Tag */}
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -bottom-4 right-0 text-cyan-400 font-mono text-xs md:text-sm font-bold tracking-widest"
                                >
                                    v1.0.0
                                </motion.span>
                            </div>

                            <div className="space-y-2 text-cyan-400/90 text-lg md:text-xl font-medium w-full">
                                {step >= 8 && (
                                    <>
                                        <TypewriterLine text="> [INIT] Walrus Protocol Interface v2.4.0" delay={0.2} />
                                        <TypewriterLine text="> [AUTH] Identity Verified: Paracasual Labs" delay={1.2} />
                                        <TypewriterLine text="> [LOAD] EventLedger Module... OK" delay={2.2} />
                                        <TypewriterLine text="> [SYNC] Grant Proposal (25k) Status: READY" delay={3.2} />
                                        <TypewriterLine text="> [EXEC] Launching Interactive Environment..." delay={4.2} />
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mouse Cursor Animation */}
                <AnimatePresence>
                    {step >= 2 && step <= 4 && (
                        <motion.div
                            className="absolute z-50 pointer-events-none"
                            initial={{ x: "100vw", y: "100vh" }}
                            animate={step === 2 ? { x: 320, y: 10 } : step === 3 ? { scale: 0.8 } : { opacity: 0 }}
                            transition={step === 2 ? { duration: 1.2, ease: "circOut" } : { duration: 0.1 }}
                        >
                            {/* SVG Cursor */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19179H20.5002L8.29729 12.3673H5.65376Z" fill="white" stroke="black" strokeWidth="1" />
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

function TypewriterLine({ text, delay }: { text: string; delay: number }) {
    const [displayed, setDisplayed] = useState("")
    const [done, setDone] = useState(false)

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            let i = 0
            const interval = setInterval(() => {
                if (i < text.length) {
                    setDisplayed(text.slice(0, i + 1))
                    i++
                } else {
                    clearInterval(interval)
                    setDone(true)
                }
            }, 20)
            return () => clearInterval(interval)
        }, delay * 1000)
        return () => clearTimeout(startTimeout)
    }, [text, delay])

    return (
        <div className="flex items-center">
            <span>{displayed}</span>
            {!done && displayed.length > 0 && <span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-pulse" />}
        </div>
    )
}
