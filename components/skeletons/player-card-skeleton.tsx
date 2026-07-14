import { Skeleton } from '@/components/ui/skeleton'

export function PlayerCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="w-full h-48" />

      <div className="p-4 space-y-3">
        {/* Player name */}
        <Skeleton className="h-6 w-40" />

        {/* Position and number */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Action button */}
        <Skeleton className="h-9 w-full mt-4" />
      </div>
    </div>
  )
}

export function PlayerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PlayerCardSkeleton key={i} />
      ))}
    </div>
  )
}
