import { type HTMLAttributes, type CSSProperties } from 'react'
import { get } from 'lodash-es'
import { cn } from '@/utils'
import { useRecordContext, type RaRecord } from '../../contexts/RecordContext'

export interface ImageFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The field name in the record containing the image URL or array of images */
  source: string
  /** Optional record to use instead of RecordContext */
  record?: RaRecord
  /** Optional label to display above the image */
  label?: string
  /** Text to display when value is empty/null/undefined */
  emptyText?: string
  /**
   * Title for the image alt text.
   * If it matches a field name in the record, uses that field's value.
   * Otherwise uses the string directly.
   */
  title?: string
  /**
   * For array sources, the field name in each item containing the image URL.
   * Defaults to 'src'.
   */
  src?: string
  /** Custom styles for the image element */
  sx?: CSSProperties
}

/**
 * ImageField component displays an image from a record field.
 *
 * @example
 * ```tsx
 * // Basic usage with RecordContext
 * <RecordContextProvider value={{ id: 1, avatar: 'https://example.com/image.jpg' }}>
 *   <ImageField source="avatar" />
 * </RecordContextProvider>
 *
 * // With custom alt text
 * <ImageField source="avatar" title="User Avatar" />
 *
 * // With alt text from another field
 * <ImageField source="avatar" title="name" />
 *
 * // With label
 * <ImageField source="avatar" label="Profile Picture" />
 *
 * // With custom styles
 * <ImageField source="avatar" sx={{ width: 100, height: 100, borderRadius: '50%' }} />
 *
 * // With array of images
 * <ImageField source="photos" src="url" title="caption" />
 * ```
 */
export function ImageField({
  source,
  record: recordProp,
  label,
  emptyText = '',
  title,
  src: srcField = 'src',
  sx,
  className,
  ...rest
}: ImageFieldProps) {
  const recordContext = useRecordContext()
  const record = recordProp ?? recordContext

  const value = get(record, source)
  const isEmpty = value == null || value === '' || (Array.isArray(value) && value.length === 0)

  // Handle empty state
  if (isEmpty) {
    if (label) {
      return (
        <div className={cn(className)} {...rest}>
          <span className="block text-sm font-medium text-muted-foreground">{label}</span>
          <span>{emptyText}</span>
        </div>
      )
    }
    return (
      <span className={cn(className)} {...rest}>
        {emptyText}
      </span>
    )
  }

  // Get alt text
  const getAltText = (item?: RaRecord | null, defaultAlt?: string): string => {
    if (!title) return defaultAlt || source

    // Check if title is a field name in the record/item
    const titleFromRecord = item ? get(item, title) : get(record, title)
    if (titleFromRecord != null) {
      return String(titleFromRecord)
    }

    // Use title as-is
    return title
  }

  // Handle array of images
  if (Array.isArray(value)) {
    const images = value.map((item, index) => {
      const imageUrl = get(item, srcField) || item
      const altText = getAltText(item, `${source}-${index}`)

      return (
        <img
          key={index}
          src={String(imageUrl)}
          alt={altText}
          style={sx}
          className="object-cover"
        />
      )
    })

    if (label) {
      return (
        <div className={cn('flex flex-wrap gap-2', className)} {...rest}>
          <span className="block w-full text-sm font-medium text-muted-foreground">{label}</span>
          {images}
        </div>
      )
    }

    return (
      <div className={cn('flex flex-wrap gap-2', className)} {...rest}>
        {images}
      </div>
    )
  }

  // Single image
  const imageUrl = String(value)
  const altText = getAltText(null, source)

  if (label) {
    return (
      <div className={cn(className)} {...rest}>
        <span className="block text-sm font-medium text-muted-foreground">{label}</span>
        <img src={imageUrl} alt={altText} style={sx} className="object-cover" />
      </div>
    )
  }

  return (
    <div className={cn(className)} {...rest}>
      <img src={imageUrl} alt={altText} style={sx} className="object-cover" />
    </div>
  )
}

ImageField.displayName = 'ImageField'
