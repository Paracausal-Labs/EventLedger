"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
    Html,
    Float,
    Environment,
    PerspectiveCamera,
    ContactShadows,
    RoundedBox,
    MeshTransmissionMaterial,
    Instances,
    Instance,
} from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { usePresenterStore } from "@/store/presenter-store"
import { Check, Loader2 } from "lucide-react"

// --- Types ---
type SceneState = "FORM" | "SUBMIT" | "EVENT_PAGE" | "JOIN_FOUNTAIN" | "RESET"

// --- Constants ---
const TIMING = {
    FORM_TYPING: 8000,
    SUBMIT_DELAY: 1000,
    SPINNER: 1500,
    MORPH: 1000,
    EVENT_PAGE_VIEW: 6000,
    FOUNTAIN_RISE: 5000,
    RESET_FADE: 1000,
}

const TARGETS = {
    name: "Walrus Hackathon",
    date: "Jan 25, 2026",
    location: "Walrus HQ, SF",
    capacity: "500",
    desc: "Join us for an exciting hackathon event!"
}

// --- Main Component ---
export function HeroDemoCard() {
    const { isPresenterMode } = usePresenterStore()
    const [scene, setScene] = useState<SceneState>("FORM")

    useEffect(() => {
        let isMounted = true

        const wait = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, isPresenterMode ? ms * 1.5 : ms))

        const runSequence = async () => {
            if (!isPresenterMode) {
                // Standard Loop
            }

            // 1. FORM STATE
            setScene("FORM")
            await wait(TIMING.FORM_TYPING + 2000)
            if (!isMounted) return

            // 2. CLICK SUBMIT
            setScene("SUBMIT")
            await wait(TIMING.SPINNER + 500)
            if (!isMounted) return

            // 3. EVENT PAGE
            setScene("EVENT_PAGE")
            await wait(TIMING.EVENT_PAGE_VIEW)
            if (!isMounted) return

            // 4. JOIN FOUNTAIN
            setScene("JOIN_FOUNTAIN")
            await wait(TIMING.FOUNTAIN_RISE)
            if (!isMounted) return

            // 5. RESET
            setScene("RESET")
            await wait(TIMING.RESET_FADE)
            if (!isMounted) return

            runSequence()
        }

        runSequence()

        return () => {
            isMounted = false
        }
    }, [isPresenterMode])

    return (
        <div
            className="relative h-[520px] w-full max-w-[420px] overflow-hidden rounded-[24px] border border-cyan-500/20 bg-[#0B0F12] shadow-2xl"
            role="region"
            aria-label="Product Demo Animation"
        >
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                shadows
            >
                <SceneContent sceneOffset={scene} />
            </Canvas>

            <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/5" />
        </div>
    )
}

function SceneContent({ sceneOffset }: { sceneOffset: SceneState }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
            <Environment preset="city" blur={0.8} background={false} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
            <spotLight
                position={[-10, 15, 0]}
                angle={0.3}
                penumbra={1}
                intensity={2}
                castShadow
            />

            <Float
                speed={1.5}
                rotationIntensity={0.2}
                floatIntensity={0.5}
                floatingRange={[-0.1, 0.1]}
            >
                <group position={[0, -0.5, 0]}>
                    <FormPanel visible={sceneOffset === "FORM" || sceneOffset === "SUBMIT"} state={sceneOffset} />
                    <EventPagePanel visible={sceneOffset === "EVENT_PAGE"} />
                    <FountainSystem active={sceneOffset === "JOIN_FOUNTAIN"} />
                </group>
            </Float>

            <ContactShadows
                position={[0, -4.5, 0]}
                opacity={0.4}
                scale={20}
                blur={2}
                far={4.5}
            />
        </>
    )
}

// --- Scene 1 & 2: Form & Submit ---

function FormPanel({ visible, state }: { visible: boolean; state: SceneState }) {
    if (!visible) return null

    return (
        <mesh>
            <RoundedBox args={[6, 7, 0.2]} radius={0.2}>
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.1}
                    color="#0f172a"
                />
            </RoundedBox>

            <Html
                transform
                occlude
                position={[0, 0, 0.11]}
                style={{
                    width: "380px",
                    height: "480px",
                    pointerEvents: "none",
                }}
            >
                <FormContent isSubmitting={state === "SUBMIT"} />
            </Html>
        </mesh>
    )
}

function FormContent({ isSubmitting }: { isSubmitting: boolean }) {
    const [fieldIndex, setFieldIndex] = useState(0)
    const [values, setValues] = useState({
        name: "",
        date: "",
        location: "",
        capacity: "",
        desc: ""
    })

    useEffect(() => {
        if (isSubmitting) return

        let currentField = 0
        let charIndex = 0
        let timeout: NodeJS.Timeout

        const typeNext = () => {
            const fields = Object.keys(TARGETS) as Array<keyof typeof TARGETS>
            if (currentField >= fields.length) return

            const field = fields[currentField]
            const targetText = TARGETS[field]

            // Ensure we don't go out of bounds
            if (charIndex < targetText.length) {
                const char = targetText[charIndex]
                if (char) { // Extra safety check
                    setValues(prev => ({
                        ...prev,
                        [field]: prev[field] + char
                    }))
                }
                charIndex++
                // Randomize typing speed for realism
                timeout = setTimeout(typeNext, 40 + Math.random() * 60)
            } else {
                currentField++
                charIndex = 0
                setFieldIndex(currentField)
                timeout = setTimeout(typeNext, 500) // Pause between fields
            }
        }

        timeout = setTimeout(typeNext, 800)
        return () => clearTimeout(timeout)
    }, [isSubmitting])

    return (
        <div className="relative flex h-full w-full flex-col gap-4 p-6 font-sans text-white/90 antialiased selection:bg-cyan-500/30">
            <div className="mb-2 text-xl font-bold tracking-tight text-white">
                Create Event
            </div>

            <div className="space-y-4">
                <InputField label="Event Name" value={values.name} active={fieldIndex === 0} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Date" value={values.date} active={fieldIndex === 1} />
                    <InputField label="Location" value={values.location} active={fieldIndex === 2} />
                </div>
                <InputField label="Capacity" value={values.capacity} active={fieldIndex === 3} />
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Description</label>
                    <div className={`h-20 rounded-lg border bg-slate-900/50 p-3 text-sm transition-colors ${fieldIndex === 4 ? 'border-cyan-500/50 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]' : 'border-slate-800'}`}>
                        {values.desc}
                        {fieldIndex === 4 && <span className="animate-pulse text-cyan-500">|</span>}
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <motion.button
                    layout
                    className={`w-full rounded-lg py-3 text-sm font-semibold transition-all duration-300 ${isSubmitting
                        ? "bg-green-500 text-white"
                        : "bg-slate-800 text-slate-400"
                        }`}
                    animate={{
                        scale: isSubmitting ? 0.95 : 1,
                        backgroundColor: isSubmitting ? "#22c55e" : "#1e293b"
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isSubmitting ? (
                            <motion.span
                                key="submitting"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <Check className="h-4 w-4" />
                                Created!
                            </motion.span>
                        ) : (
                            <motion.span
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Create Event
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            <CursorOverlay fieldIndex={fieldIndex} isSubmitting={isSubmitting} />
        </div>
    )
}

function InputField({ label, value, active }: { label: string, value: string, active: boolean }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">{label}</label>
            <div className={`flex h-10 items-center rounded-lg border bg-slate-900/50 px-3 text-sm transition-colors ${active ? 'border-cyan-500/50 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]' : 'border-slate-800'}`}>
                {value}
                {active && <span className="animate-pulse text-cyan-500">|</span>}
            </div>
        </div>
    )
}

function CursorOverlay({ fieldIndex, isSubmitting }: { fieldIndex: number, isSubmitting: boolean }) {
    const POSITIONS = [
        { x: 180, y: 80 },  // Name
        { x: 80, y: 150 },  // Date
        { x: 280, y: 150 }, // Location
        { x: 180, y: 220 }, // Capacity
        { x: 180, y: 290 }, // Desc
        { x: 180, y: 400 }, // Button
    ]

    const target = isSubmitting ? POSITIONS[5] : (POSITIONS[fieldIndex] || POSITIONS[0])

    return (
        <motion.div
            className="pointer-events-none absolute left-0 top-0 z-50 text-white drop-shadow-lg"
            animate={{ x: target.x, y: target.y }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 -rotate-12 translate-x-[-4px] translate-y-[-4px]"
            >
                <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="currentColor" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        </motion.div>
    )
}

// --- Scene 3: Event Page ---

function EventPagePanel({ visible }: { visible: boolean }) {
    if (!visible) return null
    return (
        <mesh>
            <RoundedBox args={[6, 7, 0.2]} radius={0.2}>
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    color="#0f172a"
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                />
            </RoundedBox>
            <Html transform occlude position={[0, 0, 0.11]} style={{ width: "380px", height: "480px" }}>
                <EventPageContent />
            </Html>
        </mesh>
    )
}

function EventPageContent() {
    const [pageIndex, setPageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setPageIndex(i => (i + 1) % 3)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const CONTROLS = [
        { title: "Smart Contracts", color: "from-cyan-500 to-blue-600", icon: "⚡" },
        { title: "Encrypted Data", color: "from-purple-500 to-pink-600", icon: "🔒" },
        { title: "Global Events", color: "from-amber-400 to-orange-600", icon: "🌍" }
    ]

    return (
        <div className="flex h-full w-full flex-col bg-slate-950 p-6 text-white overflow-hidden font-sans">
            {/* Hero Card Carousel */}
            <div className="relative mb-8 h-48 w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={pageIndex}
                        className={`absolute inset-0 bg-gradient-to-br ${CONTROLS[pageIndex].color} flex flex-col items-center justify-center`}
                        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        <div className="text-6xl mb-2 drop-shadow-md">{CONTROLS[pageIndex].icon}</div>
                        <div className="text-xl font-bold text-white/90 drop-shadow-md">{CONTROLS[pageIndex].title}</div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {CONTROLS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === pageIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"}`}
                        />
                    ))}
                </div>
            </div>

            {/* Event Title - Animated */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">Active Event</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-white mb-4">
                    Walrus Hackathon
                </h2>
            </motion.div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
                {["zkLogin", "Sui Move", "Walrus Blobs"].map((tag, i) => (
                    <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm"
                    >
                        {tag}
                    </motion.span>
                ))}
            </div>

            {/* Metadata Footer */}
            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                        Date
                    </div>
                    <div className="text-sm font-semibold text-slate-200">Jan 25, 2026</div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        Location
                    </div>
                    <div className="text-sm font-semibold text-slate-200">Walrus HQ, SF</div>
                </div>
            </div>
        </div>
    )
}


// --- Scene 4: Fountain ---

function FountainSystem({ active }: { active: boolean }) {
    // 120 Particles
    const count = 120
    return (
        <group>
            <ParticleEmitter active={active} count={count} />
        </group>
    )
}

function ParticleEmitter({ active, count }: { active: boolean, count: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    // Initial State
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            x: (Math.random() - 0.5) * 6,
            y: -8 - Math.random() * 5,
            z: (Math.random() - 0.5) * 3,
            speed: 2 + Math.random() * 3,
            offset: Math.random() * 100,
            scale: 0.3 + Math.random() * 0.4,
            active: false
        }))
    }, [count])

    useFrame((state, delta) => {
        if (!meshRef.current) return

        particles.forEach((particle, i) => {
            if (active) {
                // Activate staggered chance
                if (!particle.active && Math.random() > 0.92) {
                    particle.active = true
                    particle.y = -6
                }
            }

            if (particle.active) {
                particle.y += particle.speed * delta
                particle.x += Math.sin(state.clock.elapsedTime * 2 + particle.offset) * 0.02

                // Reset limit
                if (particle.y > 6) {
                    if (active) particle.y = -6
                    else particle.active = false
                }
            } else {
                particle.y = -20
            }

            dummy.position.set(particle.x, particle.y, particle.z)
            dummy.scale.setScalar(particle.active ? particle.scale : 0)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <circleGeometry args={[0.2, 16]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} depthWrite={false} />
        </instancedMesh>
    )
}
