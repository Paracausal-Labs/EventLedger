"use client"

import { useEffect, useState } from "react"

const ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"]

export default function AsciiGen() {
    const [ascii, setAscii] = useState("Generating...")

    useEffect(() => {
        const img = new Image()
        img.src = "/walrus.png"
        img.crossOrigin = "Anonymous"
        img.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const width = 100 // Target width
            const scale = width / img.width
            const height = Math.floor(img.height * scale * 0.55) // Adjust for char aspect ratio

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data
            let result = ""

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const offset = (y * width + x) * 4
                    const r = data[offset]
                    const g = data[offset + 1]
                    const b = data[offset + 2]
                    const avg = (r + g + b) / 3

                    // Map 0-255 to index 0-9
                    const charIndex = Math.floor((avg / 255) * (ASCII_CHARS.length - 1))
                    result += ASCII_CHARS[charIndex]
                }
                result += "\n"
            }
            setAscii(result)
        }
    }, [])

    return (
        <pre id="output" className="text-xs bg-black text-white p-4">
            {ascii}
        </pre>
    )
}
