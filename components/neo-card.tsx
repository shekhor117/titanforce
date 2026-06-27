import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NeoCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'inset' | 'soft' | 'floating' | 'panel'
  onClick?: () => void
  interactive?: boolean
}

export function NeoCard({
  children,
  className,
  variant = 'default',
  onClick,
  interactive = false,
}: NeoCardProps) {
  const variantClasses = {
    default: 'neo-card',
    inset: 'neo-card-inset',
    soft: 'neo-soft',
    floating: 'neo-floating',
    panel: 'neo-panel',
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        interactive && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface NeoButtonProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'primary'
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function NeoButton({
  children,
  className,
  variant = 'default',
  onClick,
  disabled = false,
  type = 'button',
}: NeoButtonProps) {
  const variantClasses = {
    default: 'neo-btn',
    primary: 'neo-btn neo-btn-primary',
  }

  return (
    <button
      className={cn(variantClasses[variant], disabled && 'opacity-50 cursor-not-allowed', className)}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

interface NeoBadgeProps {
  children: ReactNode
  className?: string
}

export function NeoBadge({ children, className }: NeoBadgeProps) {
  return <span className={cn('neo-badge', className)}>{children}</span>
}

interface NeoInputProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  type?: string
  className?: string
}

export function NeoInput({ placeholder, value, onChange, disabled, type = 'text', className }: NeoInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn('neo-input', className)}
    />
  )
}
