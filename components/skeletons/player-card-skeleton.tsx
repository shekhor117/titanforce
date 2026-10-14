import { Skeleton } from '@/components/ui/skeleton'

export function PlayerCardSkeleton() {
  return (
    <div className="neo-floating overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-square w-full rounded-none bg-muted/80" />
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <Skeleton className="h-5 w-3/4 bg-muted/80" />
        <Skeleton className="h-3 w-1/2 bg-muted/80" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
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
