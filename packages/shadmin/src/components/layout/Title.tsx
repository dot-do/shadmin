/**
 * Title Component
 * Displays and manages page titles within admin views
 *
 * Provides:
 * - Title component for setting page titles
 * - TitlePortal for rendering titles in specific locations
 * - Integration with document title
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'

/**
 * Title context value
 */
export interface TitleContextValue {
  title: ReactNode
  setTitle: (title: ReactNode) => void
}

const TitleContext = createContext<TitleContextValue | undefined>(undefined)

TitleContext.displayName = 'TitleContext'

/**
 * Hook to access the title context
 */
export function useTitleContext(): TitleContextValue | undefined {
  return useContext(TitleContext)
}

/**
 * Props for TitleContextProvider
 */
export interface TitleContextProviderProps {
  children: ReactNode
  defaultTitle?: ReactNode
}

/**
 * Provider for title context
 */
export function TitleContextProvider({
  children,
  defaultTitle,
}: TitleContextProviderProps) {
  const [title, setTitleState] = useState<ReactNode>(defaultTitle)

  const setTitle = useCallback((newTitle: ReactNode) => {
    setTitleState(newTitle)
  }, [])

  const value = useMemo(
    () => ({ title, setTitle }),
    [title, setTitle]
  )

  return (
    <TitleContext.Provider value={value}>
      {children}
    </TitleContext.Provider>
  )
}

/**
 * Props for Title component
 */
export interface TitleProps {
  /**
   * The title to display
   */
  title?: ReactNode
  /**
   * Default title (used when title is not provided)
   */
  defaultTitle?: string
  /**
   * Preferred source for resource name (e.g., "name" uses record.name)
   */
  preferenceKey?: string
  /**
   * Whether to update the document title
   * @default true
   */
  updateDocumentTitle?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Title - Sets the page title
 *
 * This component updates both the displayed title (via TitlePortal) and
 * optionally the document title.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Title title="Posts List" />
 *
 * // With default title
 * <Title defaultTitle="Posts" />
 *
 * // Dynamic title
 * <Title title={<span>Editing {record.name}</span>} />
 * ```
 */
export function Title({
  title,
  defaultTitle,
  preferenceKey: _preferenceKey,
  updateDocumentTitle = true,
  className,
}: TitleProps) {
  const context = useTitleContext()
  const displayTitle = title ?? defaultTitle

  // Update context title if available
  useEffect(() => {
    if (context && displayTitle) {
      context.setTitle(displayTitle)
    }
  }, [context, displayTitle])

  // Update document title
  useEffect(() => {
    if (updateDocumentTitle && typeof displayTitle === 'string') {
      const previousTitle = document.title
      document.title = displayTitle
      return () => {
        document.title = previousTitle
      }
    }
    return undefined
  }, [displayTitle, updateDocumentTitle])

  // If no context, render the title directly
  if (!context) {
    return (
      <h1 className={cn('text-2xl font-bold tracking-tight', className)}>
        {displayTitle}
      </h1>
    )
  }

  // When context exists, title is rendered via TitlePortal
  return null
}

Title.displayName = 'Title'

/**
 * Props for TitlePortal component
 */
export interface TitlePortalProps {
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Children to render if no title is set
   */
  children?: ReactNode
}

/**
 * TitlePortal - Renders the current title from context
 *
 * Place this component where you want the title to appear in your layout.
 * It will render whatever title is set via the Title component.
 *
 * @example
 * ```tsx
 * // In your layout
 * <header>
 *   <TitlePortal />
 * </header>
 *
 * // In a page
 * <Title title="Dashboard" />
 * ```
 */
export function TitlePortal({ className, children }: TitlePortalProps) {
  const context = useTitleContext()
  const title = context?.title

  if (!title && !children) {
    return null
  }

  return (
    <h1 className={cn('text-2xl font-bold tracking-tight', className)}>
      {title ?? children}
    </h1>
  )
}

TitlePortal.displayName = 'TitlePortal'
