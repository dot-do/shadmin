/**
 * ShowView Component
 * UI wrapper for show display - uses ShadCN Card as container
 * 100% API-compatible with react-admin ShowView
 *
 * Epic: shadmin-ha1 (P1)
 */

import { cn } from '../../lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

import type { RaRecord } from '../../types'
import type { ReactNode, ReactElement } from 'react'

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
      className="flex items-center justify-center py-12"
      role="progressbar"
      aria-label="Loading"
      data-testid="shadmin-show-loading"
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
    <div
      className="rounded-md border border-destructive/50 bg-destructive/10 p-4"
      data-testid="shadmin-show-error"
    >
      <p className="font-semibold text-destructive">Error</p>
      <p className="text-sm text-destructive/80 mt-1">{error.message}</p>
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
  // Helper to render header
  const renderHeader = (showActions = true) => {
    if (!title && !actions) return null
    if (!title && actions === false) return null

    return (
      <CardHeader
        className="flex flex-row items-center justify-between space-y-0 pb-4"
        data-testid="shadmin-show-header"
      >
        <div className="flex items-center gap-4">
          {title && (
            typeof title === 'string' ? (
              <CardTitle data-testid="shadmin-show-title">{title}</CardTitle>
            ) : (
              <div data-testid="shadmin-show-title">{title}</div>
            )
          )}
        </div>
        {showActions && actions !== false && actions && (
          <div className="flex items-center gap-2" data-testid="shadmin-show-actions">
            {actions}
          </div>
        )}
      </CardHeader>
    )
  }

  // Show loading state
  if (isLoading) {
    if (emptyWhileLoading && empty) {
      return empty
    }
    return (
      <div className="show-page flex gap-4" data-testid="shadmin-show-view">
        <Card className={cn('flex-1', className)} data-slot="card">
          {renderHeader(false)}
          <CardContent data-testid="shadmin-show-content">
            {loading ?? <DefaultLoading />}
          </CardContent>
        </Card>
        {aside && <div data-testid="shadmin-show-aside">{aside}</div>}
      </div>
    )
  }

  // Show error state
  if (error) {
    // Check if it's a "not found" error and show empty component if provided
    if (error.message.toLowerCase().includes('not found') && empty) {
      return (
        <div className="show-page flex gap-4" data-testid="shadmin-show-view">
          <Card className={cn('flex-1', className)} data-slot="card">
            {renderHeader(false)}
            <CardContent data-testid="shadmin-show-content">
              {empty}
            </CardContent>
          </Card>
          {aside && <div data-testid="shadmin-show-aside">{aside}</div>}
        </div>
      )
    }

    return (
      <div className="show-page flex gap-4" data-testid="shadmin-show-view">
        <Card className={cn('flex-1', className)} data-slot="card">
          {renderHeader(false)}
          <CardContent data-testid="shadmin-show-content">
            {errorComponent ?? <DefaultError error={error} />}
          </CardContent>
        </Card>
        {aside && <div data-testid="shadmin-show-aside">{aside}</div>}
      </div>
    )
  }

  // Show content
  return (
    <div className="show-page flex gap-4" data-testid="shadmin-show-view">
      <Card className={cn('flex-1', className)} data-slot="card">
        {renderHeader()}
        <CardContent data-testid="shadmin-show-content">
          {children}
        </CardContent>
      </Card>
      {aside && <div data-testid="shadmin-show-aside">{aside}</div>}
    </div>
  )
}

export default ShowView
