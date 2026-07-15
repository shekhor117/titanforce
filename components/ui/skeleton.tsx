import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-muted rounded-md overflow-hidden',
        'relative isolate',
        'before:absolute before:inset-0',
        'dark:before:bg-gradient-to-r dark:before:from-transparent dark:before:via-white/20 dark:before:to-transparent',
        'light:before:bg-gradient-to-r light:before:from-transparent light:before:via-black/10 light:before:to-transparent',
        'before:animate-shimmer before:translate-x-full',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
