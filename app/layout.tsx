import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Barlow, Noto_Sans_Bengali } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { AuthProvider } from '@/lib/auth-context'
import { AdminProvider } from '@/lib/admin-context'
import { TransitionProvider } from '@/lib/transition-context'
import { ThemeProvider } from '@/lib/theme-context'
import { CartProvider } from '@/lib/cart-context'
import { PageTransition } from '@/components/page-transition'
import { ErrorBoundary } from '@/components/error-boundary'
import LoaderWrapper from '@/components/loader-wrapper'
import { generatePageMetadata, getOrganizationSchema } from '@/lib/seo-utils'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const barlow = Barlow({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})

const notoSansBengali = Noto_Sans_Bengali({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-bengali',
})

export const metadata: Metadata = generatePageMetadata({
  title: 'Titan Force Mulikandi | Official Football Club Website',
  description: 'Official football club website',
  alternates: {
    languages: {
      en: 'https://titanforcemulikandi.vercel.app/en',
      bn: 'https://titanforcemulikandi.vercel.app/bn',
    },
  },
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1a1a',
}

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="S1BRuvXJo49oWBcV9tvlLDn2gIiL75tp0MvejZ_CLbQ" />
        
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7799270522656846" crossOrigin="anonymous"></script>
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
      </head>
      <body className={`${bebasNeue.variable} ${barlow.variable} ${notoSansBengali.variable} font-sans antialiased bg-background`}>
        <ThemeProvider>
          <TransitionProvider>
            <PageTransition />
            <AdminProvider>
              <AuthProvider>
                <CartProvider>
                  <LanguageProvider>
                    <ErrorBoundary>
                      <LoaderWrapper>
                        {children}
                      </LoaderWrapper>
                    </ErrorBoundary>
                  </LanguageProvider>
                </CartProvider>
              </AuthProvider>
            </AdminProvider>
          </TransitionProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
