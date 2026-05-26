'use client'

import { Text } from '@react-three/drei'
import { ReactNode } from 'react'

interface Text3DProps {
  text: string
  position?: [number, number, number]
  fontSize?: number
  color?: string
  rotation?: [number, number, number]
  anchorX?: 'left' | 'center' | 'right'
  anchorY?: 'top' | 'middle' | 'bottom'
  children?: ReactNode
}

export function Text3D({
  text,
  position = [0, 0, 0],
  fontSize = 1,
  color = '#ffffff',
  rotation = [0, 0, 0],
  anchorX = 'center',
  anchorY = 'middle',
  children,
}: Text3DProps) {
  return (
    <Text position={position} fontSize={fontSize} color={color} rotation={rotation} anchorX={anchorX} anchorY={anchorY}>
      {text}
      {children}
    </Text>
  )
}

export default Text3D
