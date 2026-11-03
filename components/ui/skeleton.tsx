import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-muted rounded-md overflow-hidden',
        'relative isolate',
        'before:pointer-events-none before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent',
        'dark:before:via-white/20',
        'before:animate-shimmer before:translate-x-full',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
