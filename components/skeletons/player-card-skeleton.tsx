import { Skeleton } from '@/components/ui/skeleton'

export function PlayerCardSkeleton() {
  return (
    <div className="neo-floating relative aspect-square overflow-hidden" aria-hidden="true">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-10 sm:p-4 sm:pt-12">
        <Skeleton className="h-4 w-3/4 bg-white/20" />
        <Skeleton className="h-3 w-1/2 bg-white/15" />
      </div>
      <Skeleton className="absolute right-2 top-2 h-8 w-8 rounded-sm bg-white/80" />
    </div>
  )
}

export function PlayerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6" aria-label="Loading players">
      {Array.from({ length: count }).map((_, i) => (
        <PlayerCardSkeleton key={i} />
      ))}
    </div>
  )
}
