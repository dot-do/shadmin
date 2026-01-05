/**
 * Utility for conditionally joining class names together.
 * A lightweight alternative to clsx/classnames.
 *
 * @param inputs - Class names to join
 * @returns Joined class names string
 *
 * @example
 * ```ts
 * cn('foo', 'bar') // 'foo bar'
 * cn('foo', false && 'bar') // 'foo'
 * cn('foo', undefined, 'bar') // 'foo bar'
 * ```
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}
