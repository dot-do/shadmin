import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils'
import { useRecordContext } from '../../contexts/RecordContext'
import type { RaRecord } from '../../types'

export interface FunctionFieldProps extends HTMLAttributes<HTMLSpanElement> {
  /** Function that receives the record and returns content to render */
  render: (record: RaRecord | undefined) => ReactNode | unknown
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the value */
  label?: string
  /** Text to display when render returns empty/null/undefined */
  emptyText?: string
}

/**
 * FunctionField component renders custom content based on the record.
 * It accepts a render prop that receives the current record and returns
 * any ReactNode content.
 *
 * @example
 * ```tsx
 * // Combine multiple fields
 * <RecordContextProvider value={{ id: 1, firstName: 'John', lastName: 'Doe' }}>
 *   <FunctionField render={(record) => `${record?.firstName} ${record?.lastName}`} />
 * </RecordContextProvider>
 *
 * // Custom rendering with JSX
 * <FunctionField render={(record) => (
 *   <span className="badge">{record?.status}</span>
 * )} />
 *
 * // With label
 * <FunctionField label="Full Name" render={(record) => `${record?.firstName} ${record?.lastName}`} />
 *
 * // With empty text
 * <FunctionField render={(record) => record?.nickname} emptyText="N/A" />
 * ```
 */
export function FunctionField({
  render,
  record: recordProp,
  label,
  emptyText = '',
  className,
  ...rest
}: FunctionFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const content = render(record)

  // Check if content is empty (null, undefined, or empty string)
  const isEmpty = content == null || content === ''
  const displayContent = (isEmpty ? emptyText : content) as ReactNode

  if (label) {
    return (
      <div className={cn(className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <span>{displayContent}</span>
      </div>
    )
  }

  return (
    <span className={cn(className)} {...rest}>
      {displayContent}
    </span>
  )
}

FunctionField.displayName = 'FunctionField'
