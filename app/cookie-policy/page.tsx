import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Cookie } from "lucide-react"
import { Footer } from "@/components/footer"
import { generatePageMetadata } from "@/lib/seo-utils"

export const metadata: Metadata = generatePageMetadata({
  title: "Cookie Policy",
  description: "Learn how Titan Force Mulikandi uses cookies and similar browser technologies.",
  url: "https://titanforcemulikandi.vercel.app/cookie-policy",
})

const sections = [
  {
    title: "What cookies are",
    body: "Cookies are small text files stored on your device by a website. Similar technologies, including browser storage and pixels, can serve related purposes. They help websites remember information and work reliably between visits.",
  },
  {
    title: "How we use cookies",
    body: "Titan Force Mulikandi may use cookies and similar technologies to keep you signed in, protect forms and accounts, remember language or display preferences, maintain shopping features, and understand how the website is used.",
  },
  {
    title: "Essential cookies",
    body: "These cookies are necessary for core features such as authentication, security, navigation, and session management. Because the website cannot operate correctly without them, they cannot be disabled through this page.",
  },
  {
    title: "Preference cookies",
    body: "Preference technologies remember choices such as language, theme, and other display settings. If you clear or block them, you may need to set your preferences again.",
  },
  {
    title: "Analytics and third-party services",
    body: "We may use privacy-conscious analytics and trusted providers for hosting, authentication, payments, media, or website performance. These providers may set or access technologies according to their own policies when their services are active.",
  },
  {
    title: "Managing cookies",
    body: "You can delete or block cookies through your browser settings. You can also use private browsing or device-level controls. Blocking essential cookies may prevent login, forms, shopping, or other parts of the website from working.",
  },
  {
    title: "Updates to this policy",
    body: "We may update this Cookie Policy when our services, technology, or legal obligations change. The latest version will always be available on this page with its effective date.",
  },
]

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/80 transition-colors hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="rounded-2xl bg-primary-foreground/10 p-3 sm:p-4">
              <Cookie className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/70">Titan Force Mulikandi</p>
              <h1 className="font-display text-5xl leading-none tracking-wide sm:text-7xl">Cookie Policy</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">A straightforward guide to the cookies and browser technologies that help our club website work.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="text-sm font-semibold text-primary">Effective date: September 13, 2026</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">This Cookie Policy explains how Titan Force Mulikandi uses cookies and similar technologies when you visit our website or use our services.</p>
        </div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <article key={section.title} className="border-b border-border pb-8 last:border-b-0">
              <div className="flex gap-4">
                <span className="font-display text-2xl text-primary/50" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{section.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{section.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-secondary/40 p-5 text-sm leading-6 text-muted-foreground sm:p-6">
          Questions about cookies? <Link href="/contact" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">Contact Titan Force Mulikandi</Link> for help.
          <span className="mx-2" aria-hidden="true">·</span>
          <Link href="/privacy-policy" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">Read our Privacy Policy</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
