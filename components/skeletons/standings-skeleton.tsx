import { Skeleton } from '@/components/ui/skeleton'

export function StandingsSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-7 gap-2 p-4 bg-muted border-b border-border">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>

      {/* Table rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-2 p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
          <Skeleton className="h-5 w-6" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-8" />
        </div>
      ))}
    </div>
  )
}
