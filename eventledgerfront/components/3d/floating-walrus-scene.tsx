"use client"

import React, { useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

// --- 3D WALRUS COMPONENT ---

function FloatingWalrusContent() {
    const texture = useLoader(THREE.TextureLoader, "/phone.jpeg")
    const walrusRef = useRef<THREE.Mesh>(null)
    const ringsRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        // Bobbing & Floating
        if (walrusRef.current) {
            walrusRef.current.position.y = Math.sin(time * 0.5) * 0.2
            walrusRef.current.rotation.z = Math.sin(time * 0.3) * 0.05
        }

        // Orbital Rings Rotation
        if (ringsRef.current) {
            ringsRef.current.rotation.y = time * 0.2
            ringsRef.current.rotation.z = time * 0.1
        }
    })

    const width = 6 * (texture.image.width / texture.image.height)

    return (
        <group scale={0.55}>
            {/* Central Walrus Image */}
            <mesh ref={walrusRef} rotation={[0, 0, 0]}>
                <planeGeometry args={[width, 6]} />
                <meshBasicMaterial map={texture} transparent opacity={0.9} side={THREE.DoubleSide} />
            </mesh>

            {/* Tech Halo / Orbital Rings */}
            <group ref={ringsRef}>
                {/* Ring 1 */}
                <mesh rotation={[Math.PI / 3, 0, 0]}>
                    <torusGeometry args={[3.2, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
                </mesh>
                {/* Ring 2 */}
                <mesh rotation={[-Math.PI / 3, 0, 0]}>
                    <torusGeometry args={[2.8, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
                </mesh>
                {/* Particles Ring */}
                <Points>
                    <torusGeometry args={[3.5, 0.5, 16, 50]} />
                    <PointMaterial transparent color="#06b6d4" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
                </Points>
            </group>
        </group>
    )
}

function Scene() {
    return (
        <>
            <ambientLight intensity={1.5} />
            <FloatingWalrusContent />
        </>
    )
}

export function FloatingWalrusScene() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Scene />
        </Canvas>
    )
}
