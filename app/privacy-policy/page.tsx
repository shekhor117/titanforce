import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { Footer } from "@/components/footer"
import { generatePageMetadata } from "@/lib/seo-utils"

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: "Learn how Titan Force Mulikandi collects, uses, and protects your information.",
  url: "https://titanforcemulikandi.vercel.app/privacy-policy",
})

const sections = [
  {
    title: "Information we collect",
    body: "We may collect information you provide directly, such as your name, email address, phone number, profile details, messages, and account information. We also collect limited technical information needed to keep the website secure and reliable.",
  },
  {
    title: "How we use information",
    body: "Titan Force Mulikandi uses your information to provide club services, manage accounts, respond to messages, share relevant updates, improve the website, and protect our users and systems. We do not sell your personal information.",
  },
  {
    title: "Messages and communications",
    body: "When you contact us, we use the details you submit to respond to your request and maintain club records. We may retain correspondence for service, safety, and accountability purposes.",
  },
  {
    title: "Cookies and local storage",
    body: "We may use essential cookies or browser storage to keep sessions working, remember preferences, and improve the experience. You can manage cookies through your browser settings, although some features may stop working.",
  },
  {
    title: "Third-party services",
    body: "We use trusted service providers for hosting, authentication, analytics, and data storage. These providers may process information only to deliver services to us and are expected to protect it appropriately.",
  },
  {
    title: "Data retention and security",
    body: "We retain information only for as long as reasonably necessary for the purposes described here or to meet legal and operational requirements. We use reasonable administrative and technical safeguards, but no online service can guarantee absolute security.",
  },
  {
    title: "Your choices",
    body: "You may request access to, correction of, or deletion of personal information we hold about you, subject to applicable requirements. You can also unsubscribe from non-essential communications at any time.",
  },
  {
    title: "Children’s privacy",
    body: "Our website is not intended to knowingly collect personal information from children without appropriate consent. If you believe a child has provided information improperly, please contact us so we can review it.",
  },
  {
    title: "Changes to this policy",
    body: "We may update this policy when our services or legal obligations change. The updated version will be posted on this page with a new effective date.",
  },
]

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/70">Titan Force Mulikandi</p>
              <h1 className="font-display text-5xl leading-none tracking-wide sm:text-7xl">Privacy Policy</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">Clear information about how we handle the trust you place in our football club community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="text-sm font-semibold text-primary">Effective date: September 13, 2026</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">This Privacy Policy explains how Titan Force Mulikandi collects, uses, and protects information when you visit our website or use our services.</p>
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
          Questions about this policy? <Link href="/contact" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">Contact Titan Force Mulikandi</Link> and we will be happy to help.
        </div>
      </section>
      <Footer />
    </main>
  )
}
