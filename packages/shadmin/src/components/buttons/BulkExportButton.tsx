/**
 * BulkExportButton Component
 * Exports the selected rows.
 */

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { useListContext, useResourceContext, useDataProvider, fetchRelatedRecords } from '../../facade'
import type { Exporter } from '../../facade'
import { cn } from '../../utils'

const buttonBaseStyles = cn(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
  'ring-offset-background transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50'
)

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  small: 'h-9 rounded-md px-3', // alias for 'sm' (react-admin compatibility)
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

/**
 * Props for BulkExportButton component
 */
export interface BulkExportButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The resource to export
   * If not provided, uses the resource from context
   */
  resource?: string
  /**
   * Custom exporter function
   * If not provided, uses the exporter from list context
   */
  exporter?: Exporter
  /**
   * Button label
   * @default 'Export'
   */
  label?: string
  /**
   * Icon to display before the label
   */
  icon?: ReactNode
  /**
   * Button variant
   * @default 'default'
   */
  variant?: keyof typeof buttonVariants
  /**
   * Button size
   * @default 'default'
   */
  size?: keyof typeof buttonSizes
  /**
   * Additional metadata to pass to the exporter
   */
  meta?: Record<string, unknown>
}

/**
 * Exports the selected rows.
 *
 * To be used inside the <Datagrid bulkActionButtons> prop.
 *
 * @example // basic usage
 * import { BulkDeleteButton, BulkExportButton, List, Datagrid } from 'shadmin';
 *
 * const PostBulkActionButtons = () => (
 *     <>
 *         <BulkExportButton />
 *         <BulkDeleteButton />
 *     </>
 * );
 *
 * export const PostList = () => (
 *     <List>
 *        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
 *             ...
 *       </Datagrid>
 *     </List>
 * );
 */
export const BulkExportButton = forwardRef<HTMLButtonElement, BulkExportButtonProps>(
  (
    {
      resource: resourceProp,
      exporter: exporterProp,
      label = 'Export',
      icon,
      variant = 'default',
      size = 'default',
      meta,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const resourceContext = useResourceContext()
    const resource = resourceProp ?? resourceContext
    const { exporter: contextExporter, selectedIds, data } = useListContext()
    const exporter = exporterProp ?? contextExporter
    const dataProvider = useDataProvider()

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (exporter && data && resource && selectedIds && selectedIds.length > 0) {
        // Filter data to only include selected records
        const selectedData = data.filter((record: any) => selectedIds.includes(record.id))
        // The exporter handles the export logic
        await exporter(
          selectedData,
          fetchRelatedRecords(dataProvider),
          dataProvider,
          resource
        )
      }
    }

    const hasSelection = selectedIds && selectedIds.length > 0

    return (
      <button
        ref={ref}
        type="button"
        data-testid="shadmin-bulk-export-button"
        disabled={disabled || !hasSelection || !exporter}
        className={cn(
          buttonBaseStyles,
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </button>
    )
  }
)

BulkExportButton.displayName = 'BulkExportButton'
