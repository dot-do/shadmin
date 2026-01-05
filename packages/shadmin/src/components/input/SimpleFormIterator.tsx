/**
 * SimpleFormIterator Component
 * Renders a list of form items within an ArrayInput, with add/remove functionality
 */

import {
  type ReactNode,
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
} from 'react'
import { cn } from '../../utils'
import { useArrayInputContext } from './ArrayInput'

/**
 * Props for SimpleFormIterator component
 */
export interface SimpleFormIteratorProps {
  /**
   * Children to render for each array item
   */
  children?: ReactNode
  /**
   * Whether to render items inline
   */
  inline?: boolean
  /**
   * Whether to disable the add button
   */
  disableAdd?: boolean
  /**
   * Whether to disable the remove button
   */
  disableRemove?: boolean
  /**
   * Custom add button text or element
   */
  addButton?: ReactNode
  /**
   * Function to get item label
   */
  getItemLabel?: (index: number) => string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * SimpleFormIterator component renders the items of an array field.
 * It must be used within an ArrayInput component.
 *
 * @example
 * ```tsx
 * <ArrayInput source="items">
 *   <SimpleFormIterator>
 *     <TextInput source="name" />
 *   </SimpleFormIterator>
 * </ArrayInput>
 * ```
 */
export function SimpleFormIterator({
  children,
  inline = false,
  disableAdd = false,
  disableRemove = false,
  addButton = 'Add',
  getItemLabel,
  className,
}: SimpleFormIteratorProps) {
  const {
    source,
    fieldArray,
    disabled,
    defaultValue,
    minItems,
    maxItems,
  } = useArrayInputContext()

  const { fields, append, remove } = fieldArray

  const canAdd = !maxItems || fields.length < maxItems
  const canRemove = !minItems || fields.length > minItems

  const handleAdd = () => {
    append(defaultValue ?? {})
  }

  const handleRemove = (index: number) => {
    remove(index)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn(inline ? 'flex flex-row flex-wrap gap-2' : 'space-y-2')}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            data-array-item
            className={cn(
              'relative',
              inline ? 'flex flex-row items-start gap-2' : 'flex items-start gap-2'
            )}
          >
            {getItemLabel && (
              <span className="text-sm font-medium text-muted-foreground py-2">
                {getItemLabel(index)}
              </span>
            )}
            <div className={cn('flex-1', inline ? 'flex flex-row gap-2' : 'space-y-2')}>
              {Children.map(children, (child) => {
                if (!isValidElement(child)) return child

                // Clone the child with the correct source path
                const childElement = child as ReactElement<{
                  source: string
                  disabled?: boolean
                }>

                const childSource = childElement.props.source
                const fieldSource = `${source}.${index}.${childSource}`

                return cloneElement(childElement, {
                  source: fieldSource,
                  disabled: disabled || childElement.props.disabled,
                })
              })}
            </div>
            {!disableRemove && (
              <button
                type="button"
                aria-label="Remove"
                onClick={() => handleRemove(index)}
                disabled={disabled || !canRemove}
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium',
                  'h-10 w-10 p-0',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'text-destructive'
                )}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      {!disableAdd && (
        <button
          type="button"
          aria-label={typeof addButton === 'string' ? addButton : 'Add'}
          onClick={handleAdd}
          disabled={disabled || !canAdd}
          className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium',
            'h-10 px-4 py-2',
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {typeof addButton === 'string' ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {addButton}
            </>
          ) : (
            addButton
          )}
        </button>
      )}
    </div>
  )
}

SimpleFormIterator.displayName = 'SimpleFormIterator'
