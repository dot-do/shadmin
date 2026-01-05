/**
 * Utility functions for shadmin
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with tailwind-merge and clsx
 * This is the standard ShadCN utility for combining class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
