'use client'

import { createContext, useContext, ReactNode } from 'react'

interface Scene3DContextType {
  isCanvasReady: boolean
}

const Scene3DContext = createContext<Scene3DContextType | undefined>(undefined)

export function useScene3DContext() {
  const context = useContext(Scene3DContext)
  if (!context) {
    throw new Error('useScene3DContext must be used within Scene3DProvider')
  }
  return context
}

interface Scene3DProviderProps {
  children: ReactNode
}

export function Scene3DProvider({ children }: Scene3DProviderProps) {
  return <Scene3DContext.Provider value={{ isCanvasReady: true }}>{children}</Scene3DContext.Provider>
}
