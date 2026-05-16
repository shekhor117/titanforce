import type { Metadata } from 'next'
import { Bebas_Neue, Barlow, Noto_Sans_Bengali } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { AuthProvider } from '@/lib/auth-context'
import { AdminProvider } from '@/lib/admin-context'
import { TransitionProvider } from '@/lib/transition-context'
import { ThemeProvider } from '@/lib/theme-context'
import { PageTransition } from '@/components/page-transition'
import { ErrorBoundary } from '@/components/error-boundary'
import LoaderWrapper from '@/components/loader-wrapper'
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

export const metadata: Metadata = {
  title: 'Titan Force FC | Mulikandi Football Club | টাইটান ফোর্স এফসি',
  description: 'Pride · Passion · Power - Official website of Titan Force FC, a passionate football club from Mulikandi, Sylhet. গর্ব · আবেগ · শক্তি',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${bebasNeue.variable} ${barlow.variable} ${notoSansBengali.variable} font-sans antialiased bg-background`}>
        <ThemeProvider>
          <TransitionProvider>
            <PageTransition />
            <AdminProvider>
              <AuthProvider>
                <LanguageProvider>
                  <ErrorBoundary>
                    <LoaderWrapper>
                      {children}
                    </LoaderWrapper>
                  </ErrorBoundary>
                </LanguageProvider>
              </AuthProvider>
            </AdminProvider>
          </TransitionProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
