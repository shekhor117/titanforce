import React, { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm uppercase tracking-wider rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-md hover:shadow-lg',
        primary: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg',
        ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 border border-gray-300',
        outline: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
        success: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
        // Neumorphic variants with soft shadows and glow
        neumorphic: 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-700 shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.5)] active:shadow-[0_2px_4px_rgba(0,0,0,0.05)]',
        'neumorphic-dark': 'bg-gradient-to-br from-slate-700 to-slate-600 text-white shadow-[0_8px_16px_rgba(0,0,0,0.3),0_2px_4px_rgba(255,200,100,0.2)] hover:shadow-[0_12px_24px_rgba(255,200,100,0.4)]',
        'neumorphic-accent': 'bg-gradient-to-br from-orange-300 to-orange-200 text-orange-900 shadow-[0_8px_16px_rgba(255,140,0,0.3),0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(255,140,0,0.5)]',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
      },
      state: {
        default: '',
        hover: 'hover:scale-105 hover:shadow-xl',
        active: 'scale-95 shadow-inner',
        loading: 'opacity-75 cursor-wait',
        disabled: 'opacity-50 cursor-not-allowed',
        success: 'bg-green-600 text-white',
      },
      glow: {
        none: '',
        soft: 'hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]',
        strong: 'hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]',
        warmGlow: 'hover:shadow-[0_0_30px_rgba(255,140,0,0.4)]',
      },
      shadow: {
        none: 'shadow-none',
        soft: 'shadow-md hover:shadow-lg',
        inset: 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]',
        neumorphic: 'shadow-[0_8px_16px_rgba(0,0,0,0.08)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
      glow: 'none',
      shadow: 'soft',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const ButtonModern = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      state,
      glow,
      shadow,
      isLoading,
      isSuccess,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine the actual state based on props
    let actualState = state
    if (isLoading) actualState = 'loading'
    if (isSuccess) actualState = 'success'
    if (disabled) actualState = 'disabled'

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            state: actualState,
            glow,
            shadow,
          }),
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {/* Success checkmark */}
        {isSuccess && !isLoading && (
          <svg
            className="h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        )}

        {/* Icon */}
        {icon && iconPosition === 'left' && !isLoading && !isSuccess && icon}

        {/* Text */}
        <span>{children}</span>

        {/* Icon right */}
        {icon && iconPosition === 'right' && !isLoading && !isSuccess && icon}
      </button>
    )
  }
)

ButtonModern.displayName = 'ButtonModern'

// Export variant generator for custom use
export { buttonVariants }
export type { ButtonProps }
