import { Metadata } from 'next'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"
import { generatePageMetadata, getBreadcrumbSchema } from '@/lib/seo-utils'

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
      </main>
      <Footer />
    </div>
  )
}
