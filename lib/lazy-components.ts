import dynamic from 'next/dynamic'
import React from 'react'

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-background/50">
    <div className="animate-pulse">Loading...</div>
  </div>
)

// Lazy-load all 3D components to reduce initial bundle size
export const Lazy3DFootballScene = dynamic(
  () => import('@/components/3d-football-scene').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)

export const Lazy3DShopScene = dynamic(
  () => import('@/components/3d-shop-scene').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)

export const Lazy3DGalleryScene = dynamic(
  () => import('@/components/3d-gallery-scene').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)

export const Lazy3DSquadScene = dynamic(
  () => import('@/components/3d-squad-scene').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)

export const Lazy3DFixturesScene = dynamic(
  () => import('@/components/3d-fixtures-scene').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)

export const Lazy3DAboutScene = dynamic(
  () => import('@/components/3d-about-scene').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)

export const LazySolarSystem = dynamic(
  () => import('@/components/3d-solar-system').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)

export const LazyTacticalBoard = dynamic(
  () => import('@/components/tactical-board').then(mod => mod.default),
  { loading: LoadingFallback, ssr: false }
)
