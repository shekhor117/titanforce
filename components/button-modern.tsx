import React, { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden',
  {
    variants: {
      variant: {
        // Light variants (Premium neumorphic style)
        default: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 shadow-[0_8px_16px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02] active:scale-95',
        light: 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-700 shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]',
        
        // Dark variants
        primary: 'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4),0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95',
        secondary: 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-[0_8px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.35)] active:shadow-inner',
        
        // Accent variants
        success: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-[0_8px_16px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_24px_rgba(34,197,94,0.5),0_0_20px_rgba(34,197,94,0.3)] active:scale-95',
        destructive: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_8px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_24px_rgba(239,68,68,0.5)] active:scale-95',
        
        // Special variants
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-none',
        outline: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white transition-colors',
        
        // Premium neumorphic variants
        neumorphic: 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-700 shadow-[0_8px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.5)] active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]',
        'neumorphic-dark': 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-[0_8px_16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_24px_rgba(255,200,100,0.4),0_0_40px_rgba(255,200,100,0.3)]',
        'neumorphic-accent': 'bg-gradient-to-br from-orange-300 to-orange-200 text-orange-900 shadow-[0_8px_16px_rgba(255,140,0,0.3)] hover:shadow-[0_12px_24px_rgba(255,140,0,0.5),0_0_30px_rgba(255,140,0,0.4)]',
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
        subtle: 'hover:shadow-[0_0_15px_rgba(107,114,128,0.2)]',
      },
      shadow: {
        none: 'shadow-none',
        soft: 'shadow-md hover:shadow-lg',
        inset: 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]',
        neumorphic: 'shadow-[0_8px_16px_rgba(0,0,0,0.08)]',
        premium: 'shadow-[0_12px_24px_rgba(0,0,0,0.15)]',
      },
      animated: {
        none: '',
        pulse: 'neu-animate-pulse',
        bounce: 'neu-animate-bounce hover:neu-animate-bounce',
        glow: 'neu-animate-glow',
        float: 'neu-animate-float',
        wiggle: 'neu-animate-wiggle',
        hover: 'neu-hover-lift',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
      glow: 'none',
      shadow: 'soft',
      animated: 'none',
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
  animated?: 'none' | 'pulse' | 'bounce' | 'glow' | 'float' | 'wiggle' | 'hover'
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
      animated = 'none',
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
            animated,
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
