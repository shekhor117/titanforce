import { StoreNavbar } from '@/components/store-navbar'

export const metadata = {
  title: 'Titan Force Store | Jerseys & Merchandise',
  description: 'Shop official Titan Force FC jerseys, merchandise, and equipment with customization options.',
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StoreNavbar />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  )
}
