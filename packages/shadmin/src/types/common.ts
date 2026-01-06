import type { ReactNode, HTMLAttributes, JSX } from 'react'

/**
 * Base props for all components
 */
export interface BaseProps {
  /** Additional CSS class names */
  className?: string
  /** Component ID */
  id?: string
}

/**
 * Props for components that accept children
 */
export interface WithChildren {
  children?: ReactNode
}

/**
 * Props for components that accept className
 */
export interface WithClassName {
  className?: string
}

/**
 * Props for components that support asChild pattern
 */
export interface AsChildProps {
  /** Render as child element instead of default element */
  asChild?: boolean
}

/**
 * Merge component props with HTML element props
 */
export type ComponentProps<
  T extends keyof JSX.IntrinsicElements,
  P = object,
> = P & Omit<HTMLAttributes<HTMLElementTagNameMap[T]>, keyof P>
