/**
 * ShowView Component
 * UI wrapper for show display - uses ShadCN Card as container
 * 100% API-compatible with react-admin ShowView
 *
 * Epic: shadmin-ha1 (P1)
 */

import type { ReactNode, ReactElement } from 'react'
import type { RaRecord } from '../../types'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

/**
 * Props for ShowView component
 */
export interface ShowViewProps {
  /** Child elements to render inside the show container */
  children: ReactNode
  /** Title to display in the show header */
  title?: ReactNode
  /** Custom actions component (e.g., Edit button) */
  actions?: ReactElement | false
  /** Component to display when the record is not found */
  empty?: ReactElement
  /** Additional CSS class name */
  className?: string
  /** Aside content (e.g., related information) */
  aside?: ReactElement
  /** Whether the record is currently loading */
  isLoading?: boolean
  /** Error that occurred during fetching */
  error?: Error | null
  /** The fetched record */
  record?: RaRecord
  /** Custom loading component */
  loading?: ReactElement
  /** Custom error component */
  errorComponent?: ReactElement
  /** If true, show empty component while loading */
  emptyWhileLoading?: boolean
}

/**
 * Default loading component
 */
function DefaultLoading() {
  return (
    <div
      className="flex items-center justify-center p-8"
      role="progressbar"
      aria-label="Loading"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

/**
 * Default error component
 */
function DefaultError({ error }: { error: Error }) {
  return (
    <div className="p-6 text-destructive">
      <p className="font-semibold">Error</p>
      <p className="text-sm">{error.message}</p>
    </div>
  )
}

/**
 * ShowView - UI wrapper component for show display
 *
 * This component provides the visual structure (Card container) for displaying record data.
 *
 * @example
 * ```tsx
 * // Basic usage (inside ShowBase)
 * <ShowBase resource="posts" id={1}>
 *   {(props) => (
 *     <ShowView title="Post" {...props}>
 *       <TextField source="title" />
 *     </ShowView>
 *   )}
 * </ShowBase>
 *
 * // With actions and aside
 * <ShowView
 *   title="Post Details"
 *   actions={<EditButton />}
 *   aside={<PostAside />}
 * >
 *   <TextField source="title" />
 * </ShowView>
 * ```
 */
export function ShowView({
  children,
  title,
  actions,
  empty,
  className,
  aside,
  isLoading,
  error,
  record: _record,
  loading,
  errorComponent,
  emptyWhileLoading,
}: ShowViewProps) {
  // Show loading state
  if (isLoading) {
    if (emptyWhileLoading && empty) {
      return empty
    }
    return (
      <Card className={className} data-slot="card">
        {(title || actions) && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            {title && (
              typeof title === 'string' ? (
                <CardTitle>{title}</CardTitle>
              ) : (
                title
              )
            )}
          </CardHeader>
        )}
        <CardContent>
          {loading ?? <DefaultLoading />}
        </CardContent>
      </Card>
    )
  }

  // Show error state
  if (error) {
    // Check if it's a "not found" error and show empty component if provided
    if (error.message.toLowerCase().includes('not found') && empty) {
      return (
        <Card className={className} data-slot="card">
          {(title || actions) && (
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              {title && (
                typeof title === 'string' ? (
                  <CardTitle>{title}</CardTitle>
                ) : (
                  title
                )
              )}
            </CardHeader>
          )}
          <CardContent>
            {empty}
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className={className} data-slot="card">
        {(title || actions) && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            {title && (
              typeof title === 'string' ? (
                <CardTitle>{title}</CardTitle>
              ) : (
                title
              )
            )}
          </CardHeader>
        )}
        <CardContent>
          {errorComponent ?? <DefaultError error={error} />}
        </CardContent>
      </Card>
    )
  }

  // Show content
  return (
    <Card className={className} data-slot="card">
      {(title || actions !== false) && (title || actions) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            {title && (
              typeof title === 'string' ? (
                <CardTitle>{title}</CardTitle>
              ) : (
                title
              )
            )}
          </div>
          {actions !== false && actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
      {aside}
    </Card>
  )
}

export default ShowView
