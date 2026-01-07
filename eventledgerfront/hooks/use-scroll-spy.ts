"use client"

import { useEffect, useState } from "react"

export function useScrollSpy(ids: string[], offset: number = 0) {
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        const listener = () => {
            const scroll = window.scrollY

            const position = ids
                .map((id) => {
                    const element = document.getElementById(id)
                    if (!element) return { id, top: -1 }
                    const rect = element.getBoundingClientRect()
                    const top = rect.top + scroll - offset
                    return { id, top }
                })
                .filter((item) => item.top > -1 && item.top <= scroll + 100)
                .pop()

            if (position) {
                setActiveId(position.id)
            } else if (scroll < 50) {
                setActiveId("")
            }
        }

        listener()
        window.addEventListener("scroll", listener, { passive: true })
        return () => window.removeEventListener("scroll", listener)
    }, [ids, offset])

    return activeId
}
