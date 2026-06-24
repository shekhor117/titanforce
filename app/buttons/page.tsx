import { ButtonShowcase } from '@/components/button-showcase'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Button Showcase | Titan Force',
  description: 'Showcase of premium button components with various states and effects',
}

export default function ButtonsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <ButtonShowcase />
    </main>
  )
}
