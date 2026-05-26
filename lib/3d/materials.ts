'use client'

import * as THREE from 'three'

export function createStandardMaterial(color: string = '#ffffff'): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.3,
    roughness: 0.7,
  })
}

export function createPhongMaterial(color: string = '#ffffff'): THREE.MeshPhongMaterial {
  return new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    shininess: 100,
  })
}

export function createGlassyMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    metalness: 0.1,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7,
  })
}

export function createEmissiveMaterial(color: string = '#60a5fa', intensity: number = 0.5): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    metalness: 0.5,
    roughness: 0.3,
  })
}
