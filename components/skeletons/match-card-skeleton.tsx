import { Skeleton } from '@/components/ui/skeleton'

export function MatchCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Match header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Teams section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      {/* Match details */}
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>

      {/* Action button */}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function MatchCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  )
}
