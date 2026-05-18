import { Navbar } from "@/components/navbar"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "About Us | Titan Force",
  description: "Learn about Titan Force football club, our history, values, and mission.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <About />
      </main>
      <Footer />
    </div>
  )
}
