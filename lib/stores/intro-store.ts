import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IntroStore {
  hasShown: boolean
  setShown: () => void
  reset: () => void
}

export const useIntroStore = create<IntroStore>()(
  persist(
    (set) => ({
      hasShown: false,
      setShown: () => set({ hasShown: true }),
      reset: () => set({ hasShown: false }),
    }),
    {
      name: 'intro-splash-shown',
      partialize: (state) => ({ hasShown: state.hasShown }),
    }
  )
)
