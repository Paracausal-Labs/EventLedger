"use client"

import React, { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Line, Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

// Generate points on a sphere surface
function generateSpherePoints(count: number, radius: number): Float32Array {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count)
        const theta = Math.sqrt(count * Math.PI) * phi

        positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi)
        positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
        positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
}

// Generate arc points between two positions on sphere
function generateArc(start: THREE.Vector3, end: THREE.Vector3, segments: number = 50): THREE.Vector3[] {
    const points: THREE.Vector3[] = []
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const distance = start.distanceTo(end)
    midPoint.normalize().multiplyScalar(1.5 + distance * 0.3)

    for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const point = new THREE.Vector3()

        // Quadratic bezier curve
        point.x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midPoint.x + t * t * end.x
        point.y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midPoint.y + t * t * end.y
        point.z = (1 - t) * (1 - t) * start.z + 2 * (1 - t) * t * midPoint.z + t * t * end.z

        points.push(point)
    }
    return points
}

// Convert lat/long to 3D position
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    )
}

// City locations for connection arcs
const CITIES = [
    { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Singapore", lat: 1.3521, lon: 103.8198 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Dubai", lat: 25.2048, lon: 55.2708 },
    { name: "Berlin", lat: 52.5200, lon: 13.4050 },
]

// Connection pairs
const CONNECTIONS = [
    [0, 1], [0, 2], [0, 4], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [2, 7], [6, 3]
]

function ConnectionArcs({ radius }: { radius: number }) {
    const arcPoints = useMemo(() => {
        return CONNECTIONS.map(([startIdx, endIdx]) => {
            const start = latLongToVector3(CITIES[startIdx].lat, CITIES[startIdx].lon, radius)
            const end = latLongToVector3(CITIES[endIdx].lat, CITIES[endIdx].lon, radius)
            return generateArc(start, end)
        })
    }, [radius])

    return (
        <group>
            {arcPoints.map((points, i) => (
                <Line
                    key={i}
                    points={points}
                    color="#06b6d4"
                    lineWidth={1}
                    transparent
                    opacity={0.4}
                />
            ))}
        </group>
    )
}

function CityPoints({ radius }: { radius: number }) {
    const pointsRef = useRef<THREE.Group>(null)

    const cityPositions = useMemo(() => {
        return CITIES.map(city => latLongToVector3(city.lat, city.lon, radius))
    }, [radius])

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.children.forEach((child, i) => {
                if (child instanceof THREE.Mesh) {
                    const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3
                    child.scale.setScalar(scale)
                }
            })
        }
    })

    return (
        <group ref={pointsRef}>
            {cityPositions.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshBasicMaterial color="#22d3ee" />
                </mesh>
            ))}
        </group>
    )
}

function GlobeContent() {
    const globeRef = useRef<THREE.Group>(null)

    const dotPositions = useMemo(() => generateSpherePoints(2000, 1.01), [])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        if (globeRef.current) {
            globeRef.current.rotation.y = time * 0.1
        }
    })

    return (
        <group ref={globeRef}>
            {/* Main sphere - dark with glow effect */}
            <Sphere args={[1, 64, 64]}>
                <meshBasicMaterial
                    color="#0a1628"
                    transparent
                    opacity={0.9}
                />
            </Sphere>

            {/* Wireframe overlay */}
            <Sphere args={[1.005, 32, 32]}>
                <meshBasicMaterial
                    color="#06b6d4"
                    wireframe
                    transparent
                    opacity={0.08}
                />
            </Sphere>

            {/* Dot grid on surface */}
            <Points positions={dotPositions}>
                <PointMaterial
                    transparent
                    color="#06b6d4"
                    size={0.015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>

            {/* Connection arcs */}
            <ConnectionArcs radius={1} />

            {/* City hotspots */}
            <CityPoints radius={1.02} />

            {/* Outer glow ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.1, 1.15, 64]} />
                <meshBasicMaterial
                    color="#06b6d4"
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Orbital ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[1.3, 0.008, 16, 100]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
            </mesh>
        </group>
    )
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <GlobeContent />
        </>
    )
}

export function Globe() {
    return (
        <Canvas
            camera={{ position: [0, 0, 3.5], fov: 45 }}
            style={{ background: 'transparent' }}
        >
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
        </Canvas>
    )
}
