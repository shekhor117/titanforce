import { Skeleton } from "@/components/ui/skeleton"

export function AdminLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-label="Loading admin content" role="status">
      <span className="sr-only">Loading admin content</span>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex min-h-64 flex-col gap-5 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((__, row) => (
                <div key={row} className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminRouteLoading() {
  return (
    <main className="admin-shell min-h-screen bg-background p-4 text-foreground pt-16 md:ml-64 md:p-8 md:pt-8">
      <AdminLoadingSkeleton />
    </main>
  )
}
