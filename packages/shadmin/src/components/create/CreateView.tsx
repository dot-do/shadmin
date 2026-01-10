/**
 * CreateView Component
 * UI wrapper for create display - uses ShadCN Card as container
 * 100% API-compatible with react-admin CreateView
 *
 * Epic: shadmin-ha1 (P1)
 */

import { memo, type ReactNode, type ReactElement } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

/**
 * Props for CreateView component
 */
export interface CreateViewProps {
  /** Child elements to render inside the create container */
  children: ReactNode
  /** Title to display in the create header */
  title?: ReactNode | undefined
  /** Custom actions component (e.g., Cancel button) */
  actions?: ReactElement | false | undefined
  /** Additional CSS class name */
  className?: string | undefined
  /** Aside content */
  aside?: ReactElement | undefined
}

/**
 * CreateView - UI wrapper component for create display
 *
 * This component provides the visual structure (Card container) for create forms.
 * It is typically used inside CreateBase or Create.
 *
 * @example
 * ```tsx
 * // Basic usage (inside CreateBase)
 * <CreateContextProvider value={createContext}>
 *   <CreateView title="Create Post">
 *     <SimpleForm>
 *       <TextInput source="title" />
 *     </SimpleForm>
 *   </CreateView>
 * </CreateContextProvider>
 *
 * // With custom actions
 * <CreateView
 *   title="Create Post"
 *   actions={<CancelButton />}
 * >
 *   <SimpleForm>...</SimpleForm>
 * </CreateView>
 * ```
 */
/**
 * CreateView - Memoized UI wrapper component for create display
 */
export const CreateView = memo(function CreateView({
  children,
  title,
  actions,
  className,
  aside,
}: CreateViewProps) {
  return (
    <div className="create-page flex gap-4">
      <Card className={className} data-slot="card">
        {(title || actions !== false) && (
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
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
      {aside}
    </div>
  )
})

export default CreateView
