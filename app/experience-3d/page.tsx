import type { Metadata } from 'next'
import { Scene3D } from '@/components/3d-scene'

export const metadata: Metadata = {
  title: '3D Experience | TitanForce',
  description: 'Immersive 3D user interface experience',
}

export default function Experience3DPage() {
  return (
    <main className="w-full h-screen bg-slate-950 relative overflow-hidden">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Scene3D />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-12">
        <div className="text-center space-y-4 pointer-events-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-300 text-balance">
            Welcome to 3D
          </h1>
          <p className="text-lg text-indigo-200 max-w-2xl">
            Interact with the 3D scene using your mouse. Drag to rotate, scroll to zoom, and explore the immersive experience.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
              Explore
            </button>
            <button className="px-8 py-3 border-2 border-indigo-400 text-indigo-300 hover:bg-indigo-400/10 rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Floating info cards */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-4 max-w-xs">
          <h3 className="text-indigo-400 font-bold mb-2">3D Interaction</h3>
          <p className="text-slate-300 text-sm">
            This immersive experience combines React Three Fiber with modern web technologies for a truly interactive 3D interface.
          </p>
        </div>
      </div>

      <div className="absolute top-8 right-8 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-4 max-w-xs">
          <h3 className="text-purple-400 font-bold mb-2">Performance</h3>
          <p className="text-slate-300 text-sm">
            Optimized rendering and smooth animations using WebGL for a responsive experience across devices.
          </p>
        </div>
      </div>
    </main>
  )
}
