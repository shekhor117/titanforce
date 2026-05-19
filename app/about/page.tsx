import { SiteLayout } from "@/components/site-layout"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"

export const metadata = {
  title: "About Us | Titan Force",
  description: "Learn about Titan Force football club, our history, values, and mission.",
}

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-background">
        <main>
          <AboutPageContent />
        </main>
        <Footer />
      </div>
    </SiteLayout>
  )
}
