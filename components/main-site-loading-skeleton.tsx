import { Skeleton } from '@/components/ui/skeleton'

function SectionHeadingSkeleton() {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-1 rounded-full" />
        <Skeleton className="h-9 w-48" />
      </div>
      <Skeleton className="hidden h-5 w-24 sm:block" />
    </div>
  )
}

function CardGridSkeleton({ count = 4, cardClassName = 'h-56' }: { count?: number; cardClassName?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <Skeleton className={`w-full ${cardClassName}`} />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MainSiteLoadingSkeleton() {
  return (
    <main aria-label="Loading page content" className="min-h-screen bg-background">
      <section className="border-b border-border/50 px-4 py-16 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-14 w-full max-w-2xl md:h-20" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <Skeleton className="h-12 w-36 rounded-lg" />
        </div>
      </section>
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={4} cardClassName="h-40" />
        </div>
      </section>
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={4} />
        </div>
      </section>
    </main>
  )
}

export function PublicSectionSkeleton({ variant = 'cards' }: { variant?: 'cards' | 'wide' | 'players' | 'shop' | 'gallery' }) {
  const count = variant === 'wide' ? 2 : 4
  const cardClassName = variant === 'gallery' ? 'h-64' : variant === 'players' ? 'h-72' : variant === 'shop' ? 'h-52' : 'h-40'

  return (
    <section aria-label="Loading section" className="bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeadingSkeleton />
        <CardGridSkeleton count={count} cardClassName={cardClassName} />
      </div>
    </section>
  )
}

export { CardGridSkeleton }
