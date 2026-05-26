import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"
import { generatePageMetadata, getBreadcrumbSchema } from '@/lib/seo-utils'

const About3DScene = dynamic(() => import('@/components/3d-about-scene').then(mod => ({ default: mod.About3DScene })), {
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 rounded-lg" />,
})

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us - Titan Force FC',
  description: 'Learn about Titan Force FC, our history, mission, and values. A passionate football club from Mulikandi, Sylhet, Bangladesh.',
  url: 'https://titanforcefc.com/about',
})

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <AboutPageContent />
        {/* 3D Scene Section */}
        <div className="w-full h-64 md:h-96 mt-12 mb-8">
          <About3DScene />
        </div>
      </main>
      <Footer />
    </div>
  )
}
