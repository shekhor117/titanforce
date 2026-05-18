import { Navbar } from "@/components/navbar"
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
        <section className="py-18 md:py-36 px-4">
          <div className="relative max-w-6xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary">
              Est.2025 Mulikandi, Zakigonj, Sylhet
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-6 text-foreground">
              <span className="block">About</span>
              <span className="block text-primary">The Club</span>
            </h1>
            <p className="mt-4 text-lg text-foreground/70 max-w-xl mx-auto">
              Pride · Passion · Power
            </p>
            
            <div className="mt-12">
              <p className="text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary">
                Est.2025 Mulikandi, Zakigonj, Sylhet
              </p>
              <h2 className="text-4xl md:text-5xl tracking-wide mb-2 text-foreground font-display">
                About The Team
              </h2>
              <p className="text-lg leading-relaxed text-foreground/80 max-w-2xl mx-auto mb-12">
                We are a passionate football team from Mulikandi, Zakigonj, Sylhet. We play with heart, teamwork, and pride. Every match is a chance to represent our community and push our limits on the pitch.
              </p>

              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                <div>
                  <div className="font-display text-4xl text-primary">
                    0
                  </div>
                  <div className="text-xs uppercase tracking-wider text-foreground/60 mt-1">
                    Players
                  </div>
                </div>
                <div>
                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-accent animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2l3 3h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4l-3 3H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h8z"/>
                    </svg>
                  </div>
                  <div className="text-xs uppercase tracking-wider text-foreground/60 mt-1">
                    Spirit
                  </div>
                </div>
                <div>
                  <div className="font-display text-4xl text-primary">
                    1
                  </div>
                  <div className="text-xs uppercase tracking-wider text-foreground/60 mt-1">
                    Team
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
