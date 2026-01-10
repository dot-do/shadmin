import type { ReactNode, HTMLAttributes, JSX } from 'react'

/**
 * Path type for deep object property access using dot notation.
 * Provides type-safe access to nested properties in record types.
 *
 * @example
 * ```tsx
 * type User = { id: number; profile: { name: string; address: { city: string } } }
 * type UserPaths = Path<User> // "id" | "profile" | "profile.name" | "profile.address" | "profile.address.city"
 *
 * // Usage in component props
 * interface FieldProps<T extends RaRecord> {
 *   source: Path<T>
 * }
 * ```
 */
export type Path<T, Depth extends number = 4> = Depth extends 0
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends object
          ? K | `${K}.${Path<T[K], Prev[Depth]>}`
          : K
      }[keyof T & string]
    : never

/**
 * Helper type for Path depth tracking (counts down from max depth)
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 * Get the type of a nested property using dot notation path.
 *
 * @example
 * ```tsx
 * type User = { profile: { name: string } }
 * type Name = PathValue<User, "profile.name"> // string
 * ```
 */
export type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never

/**
 * Loose path type that allows any string but provides autocomplete suggestions.
 * Use this when strict path validation would break backwards compatibility.
 *
 * @example
 * ```tsx
 * interface FieldProps<T extends RaRecord = RaRecord> {
 *   source: LoosePath<T>  // Suggests known paths but allows any string
 * }
 * ```
 */
export type LoosePath<T> = Path<T> | (string & {})

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
