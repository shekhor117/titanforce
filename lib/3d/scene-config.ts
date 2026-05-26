'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export interface Scene3DConfig {
  background: string
  fog: boolean
  fogColor: string
  fogNear: number
  fogFar: number
  camera: {
    position: [number, number, number]
    fov: number
    near: number
    far: number
  }
}

export function useScene3D(): Scene3DConfig {
  const { theme } = useTheme()
  const [config, setConfig] = useState<Scene3DConfig>({
    background: '#1a1a1a',
    fog: true,
    fogColor: '#1a1a1a',
    fogNear: 5,
    fogFar: 100,
    camera: {
      position: [0, 0, 8],
      fov: 75,
      near: 0.1,
      far: 1000,
    },
  })

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      fogColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    }))
  }, [theme])

  return config
}

export const defaultSceneConfig: Scene3DConfig = {
  background: '#1a1a1a',
  fog: true,
  fogColor: '#1a1a1a',
  fogNear: 5,
  fogFar: 100,
  camera: {
    position: [0, 0, 8],
    fov: 75,
    near: 0.1,
    far: 1000,
  },
}
