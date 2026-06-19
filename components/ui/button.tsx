import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-95 active:shadow-inner",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:bg-primary/80 dark:hover:shadow-lg dark:hover:shadow-primary/20',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 active:bg-destructive/75',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-md dark:bg-input/30 dark:border-input dark:hover:bg-input/50 active:bg-accent/80',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md active:bg-secondary/70',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:bg-accent/80',
        link: 'text-primary underline-offset-4 hover:underline active:opacity-75',
        glass:
          'glass-btn text-foreground hover:shadow-lg active:scale-95',
        'glass-primary':
          'glass-btn-primary text-primary-foreground hover:shadow-lg active:scale-95',
        'glass-accent':
          'glass-btn-accent text-accent-foreground hover:shadow-lg active:scale-95',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3 min-h-[44px] md:min-h-9',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 min-h-[40px] md:min-h-8',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4 min-h-[44px]',
        icon: 'size-9 min-w-[44px] min-h-[44px] md:min-w-9 md:min-h-9',
        'icon-sm': 'size-8 min-w-[40px] min-h-[40px] md:min-w-8 md:min-h-8',
        'icon-lg': 'size-10 min-w-[44px] min-h-[44px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
