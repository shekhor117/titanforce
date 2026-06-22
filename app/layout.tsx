import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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
import { generatePageMetadata, getOrganizationSchema, defaultViewport } from '@/lib/seo-utils'
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

export const viewport: Viewport = defaultViewport

export const metadata: Metadata = generatePageMetadata({
  title: 'Titan Force Mulikandi | Official Football Club Website',
  description: 'Official football club website',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    languages: {
      en: 'https://titanforcemulikandi.vercel.app/en',
      bn: 'https://titanforcemulikandi.vercel.app/bn',
    },
  },
})

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
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Favicon Links */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
      </head>
      <body className={`${bebasNeue.variable} ${barlow.variable} ${notoSansBengali.variable} font-sans antialiased bg-background`}>
        <Script
          id="error-handler"
          dangerouslySetInnerHTML={{
            __html: `
              const originalError = console.error;
              console.error = function(...args) {
                // Suppress error event objects that only have isTrusted property
                if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && 
                    Object.keys(args[0]).length === 1 && args[0].isTrusted === true) {
                  return;
                }
                originalError.apply(console, args);
              };
            `,
          }}
        />
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
