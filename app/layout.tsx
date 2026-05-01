import type { Metadata } from 'next'
import { Bebas_Neue, Barlow, Noto_Sans_Bengali } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { AuthProvider } from '@/lib/auth-context'
import { AdminProvider } from '@/lib/admin-context'
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${bebasNeue.variable} ${barlow.variable} ${notoSansBengali.variable} font-sans antialiased bg-background`}>
        <AdminProvider>
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </AdminProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
