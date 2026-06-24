'use client'

import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const neumorphicButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden',
  {
    variants: {
      variant: {
        // Light neumorphic (convex effect)
        light: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.7),inset_2px_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15),inset_-2px_-2px_8px_rgba(255,255,255,0.8),inset_2px_2px_8px_rgba(0,0,0,0.08)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(255,255,255,0.5)] active:scale-95',
        
        // Dark neumorphic (convex effect)
        dark: 'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.15),inset_2px_2px_6px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.5),inset_-2px_-2px_8px_rgba(255,255,255,0.2),inset_2px_2px_8px_rgba(0,0,0,0.6)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(255,255,255,0.1)] active:scale-95',
        
        // Soft neumorphic (minimal depth)
        soft: 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.6)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),inset_-1px_-1px_4px_rgba(255,255,255,0.7)] active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] active:scale-95',
        
        // Bold neumorphic (high contrast)
        bold: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 shadow-[0_12px_24px_rgba(0,0,0,0.15),inset_-3px_-3px_8px_rgba(255,255,255,0.8),inset_3px_3px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.2),inset_-3px_-3px_10px_rgba(255,255,255,0.9),inset_3px_3px_10px_rgba(0,0,0,0.12)] active:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.2),inset_-2px_-2px_8px_rgba(255,255,255,0.4)] active:scale-95',
        
        // Concave neumorphic (pressed into surface)
        concave: 'bg-gradient-to-br from-gray-100 to-gray-100 text-gray-700 shadow-[inset_0_8px_16px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(255,255,255,0.5)] hover:shadow-[inset_0_10px_20px_rgba(0,0,0,0.12),inset_0_-2px_4px_rgba(255,255,255,0.6)] active:shadow-[inset_0_12px_24px_rgba(0,0,0,0.15)] active:scale-95',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-10 py-5 text-lg',
      },
      effect: {
        none: '',
        glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3),0_8px_16px_rgba(0,0,0,0.1)]',
        pulse: 'hover:animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'light',
      size: 'md',
      effect: 'none',
    },
  }
)

interface NeumorphicButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neumorphicButtonVariants> {
  children: ReactNode
  isLoading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const NeumorphicButton = React.forwardRef<
  HTMLButtonElement,
  NeumorphicButtonProps
>(
  (
    {
      className,
      variant,
      size,
      effect,
      isLoading,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          neumorphicButtonVariants({ variant, size, effect }),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
          </>
        )}
      </button>
    )
  }
)

NeumorphicButton.displayName = 'NeumorphicButton'
