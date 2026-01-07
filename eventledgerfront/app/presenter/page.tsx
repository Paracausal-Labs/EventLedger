"use client"

import { useEffect } from "react"
import { usePresenterStore } from "@/store/presenter-store"
import Home from "../page"

export default function PresenterPage() {
    const { setPresenterMode } = usePresenterStore()

    useEffect(() => {
        setPresenterMode(true)
        return () => setPresenterMode(false)
    }, [setPresenterMode])

    return <Home />
}
