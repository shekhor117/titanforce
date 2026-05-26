'use client'

export interface LightsConfig {
  ambientLight: {
    intensity: number
    color: string
  }
  directionalLight: {
    intensity: number
    color: string
    position: [number, number, number]
  }
  pointLight: {
    intensity: number
    color: string
    position: [number, number, number]
  }
}

export const defaultLightsConfig: LightsConfig = {
  ambientLight: {
    intensity: 0.6,
    color: '#ffffff',
  },
  directionalLight: {
    intensity: 0.8,
    color: '#ffffff',
    position: [10, 10, 10],
  },
  pointLight: {
    intensity: 0.5,
    color: '#60a5fa',
    position: [0, 5, 0],
  },
}
