import { Skeleton } from '@/components/ui/skeleton'

export function NewsArticleSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Featured image */}
      <Skeleton className="w-full h-48" />

      <div className="p-4 space-y-3">
        {/* Category */}
        <Skeleton className="h-4 w-20" />

        {/* Title */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Meta (date, author) */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

export function NewsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsArticleSkeleton key={i} />
      ))}
    </div>
  )
}
