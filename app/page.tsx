"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { GalleryShowcase } from "@/components/gallery-showcase"
import { TrophyTimeline } from "@/components/trophy-timeline"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Scene3DCanvas } from "@/components/3d/3d-scene-canvas"
import { ParticleSystem } from "@/components/3d/particle-system"
import { useScene3D } from "@/lib/3d/scene-config"

export default function Home() {
  // Check if hero animation has been shown this session
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    // Add JSON-LD BreadcrumbList
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://titanforcefc.com',
        },
      ],
    }
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)

    // Check sessionStorage after mount
    const alreadyShown = sessionStorage.getItem("hero-shown")
    if (alreadyShown) {
      setHasSeenAnimation(true)
      setHeroLoading(false)
    }

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const handleLoadingChange = (loading: boolean) => {
    setHeroLoading(loading)
    if (!loading) {
      sessionStorage.setItem("hero-shown", "true")
    }
  }

  const sceneConfig = useScene3D()

  return (
    <div className="min-h-screen bg-background stripe-bg relative w-full">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <Canvas
          camera={{
            position: sceneConfig.camera.position,
            fov: sceneConfig.camera.fov,
            near: sceneConfig.camera.near,
            far: sceneConfig.camera.far,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <color attach="background" args={[sceneConfig.background]} />
          {sceneConfig.fog && <fog attach="fog" args={[sceneConfig.fogColor, sceneConfig.fogNear, sceneConfig.fogFar]} />}
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight intensity={0.8} color="#ffffff" position={[10, 10, 10]} />
          <pointLight intensity={0.5} color="#60a5fa" position={[0, 5, 0]} />
          <ParticleSystem />
        </Canvas>
      </div>

      {/* 2D Content Overlay */}
      <div className="relative z-10 min-h-screen bg-background stripe-bg">
        <Navbar />
        <main>
          <Hero onLoadingChange={handleLoadingChange} skipAnimation={hasSeenAnimation} />
          <GalleryShowcase />
          <TrophyTimeline />
          <Contact />
        </main>
        {!heroLoading && <Footer />}
      </div>
    </div>
  )
}
