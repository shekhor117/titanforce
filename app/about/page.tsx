import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"

export const metadata = {
  title: "About Us | Titan Force",
  description: "Learn about Titan Force football club, our history, values, and mission.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <AboutPageContent />
      </main>
      <Footer />
    </div>
  )
}
