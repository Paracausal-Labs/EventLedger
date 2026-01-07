import { create } from 'zustand'

interface PresenterState {
    isPresenterMode: boolean
    togglePresenterMode: () => void
    setPresenterMode: (active: boolean) => void
}

export const usePresenterStore = create<PresenterState>()((set) => ({
    isPresenterMode: false,
    togglePresenterMode: () => set((state) => ({ isPresenterMode: !state.isPresenterMode })),
    setPresenterMode: (active) => set({ isPresenterMode: active }),
}))
