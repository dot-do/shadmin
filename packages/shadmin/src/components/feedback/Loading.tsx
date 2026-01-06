/**
 * Loading Component
 * A customizable loading spinner with different sizes and variants
 *
 * Features:
 * - Multiple sizes (sm, default, lg, xl)
 * - Custom color support
 * - Optional text label
 * - Fullscreen overlay mode
 */

import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Loading component props
 */
export interface LoadingProps {
  /** Size variant of the spinner */
  size?: 'sm' | 'default' | 'lg' | 'xl'
  /** Optional text to display below the spinner */
  text?: string
  /** Display as fullscreen overlay */
  fullscreen?: boolean
  /** Custom CSS class for the spinner */
  className?: string
  /** Custom CSS class for the container */
  containerClassName?: string
  /** Primary color for the spinner */
  color?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  default: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
}

const textSizeClasses = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

/**
 * Loading - A spinner component for indicating loading states
 *
 * @example
 * ```tsx
 * // Simple spinner
 * <Loading />
 *
 * // With text and larger size
 * <Loading size="lg" text="Loading data..." />
 *
 * // Fullscreen overlay
 * <Loading fullscreen text="Please wait..." />
 * ```
 */
export function Loading({
  size = 'default',
  text,
  fullscreen = false,
  className,
  containerClassName,
  color,
}: LoadingProps) {
  const spinner = (
    <div
      role="status"
      aria-label={text || 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        containerClassName
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-current border-t-transparent',
          sizeClasses[size],
          className
        )}
        style={color ? { borderColor: color, borderTopColor: 'transparent' } : undefined}
      />
      {text && (
        <p className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </p>
      )}
      <span className="sr-only">{text || 'Loading'}</span>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}

Loading.displayName = 'Loading'
