/**
 * ImageInput Component
 * A form input component for image upload with preview that integrates with react-hook-form
 */

import {
  forwardRef,
  useId,
  useState,
  useEffect,
  useCallback,
  useRef,
  type InputHTMLAttributes,
  type DragEvent,
} from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Accept prop can be a string (for native HTML input) or an object mapping
 * MIME types to file extensions (for react-dropzone compatibility).
 * @example
 * accept="image/*"
 * accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
 */
export type ImageAcceptProp = string | Record<string, string[]>

/**
 * Props for ImageInput component
 */
export interface ImageInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'type' | 'value' | 'onChange' | 'accept'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the input.
   */
  source: Path<T>
  /**
   * Label text displayed above the input.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the input.
   */
  helperText?: string
  /**
   * Validation rules passed to react-hook-form.
   */
  rules?: RegisterOptions<T>
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Maximum file size in bytes. Files larger than this will be rejected.
   */
  maxSize?: number
  /**
   * Accept specific file types. Can be a string or an object mapping
   * MIME types to extensions. Defaults to "image/*".
   * @example
   * accept="image/*"
   * accept={{ 'image/*': ['.png', '.jpg'] }}
   */
  accept?: ImageAcceptProp
  /**
   * Default value for the field.
   */
  defaultValue?: File | File[]
}

/**
 * Image preview item with URL and file reference
 */
interface ImagePreview {
  id: string
  url: string
  file: File
}

/**
 * Generate unique ID for preview items
 */
let previewIdCounter = 0
function generatePreviewId(): string {
  return `preview-${Date.now()}-${previewIdCounter++}`
}

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Convert accept prop to string format for native input element.
 * Handles both string and object formats.
 */
function normalizeAccept(accept: ImageAcceptProp | undefined): string | undefined {
  if (!accept) return undefined
  if (typeof accept === 'string') return accept
  // Convert object format { 'image/*': ['.png', '.jpg'] } to "image/*,.png,.jpg"
  const parts: string[] = []
  for (const [mimeType, extensions] of Object.entries(accept)) {
    parts.push(mimeType)
    if (Array.isArray(extensions)) {
      parts.push(...extensions)
    }
  }
  return parts.join(',')
}

/**
 * ImageInput component for form image upload with preview.
 * Supports single and multiple image selection, drag-and-drop, and file size validation.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ImageInput source="avatar" label="Profile Picture" />
 *
 * // With file size limit (2MB)
 * <ImageInput
 *   source="photo"
 *   label="Photo"
 *   maxSize={2 * 1024 * 1024}
 * />
 *
 * // Multiple images
 * <ImageInput
 *   source="gallery"
 *   label="Gallery"
 *   multiple
 * />
 * ```
 */
export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  (
    {
      source,
      label,
      helperText,
      rules,
      fullWidth,
      className,
      disabled,
      required,
      multiple,
      maxSize,
      accept = 'image/*',
      defaultValue,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const inputId = generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const inputRef = useRef<HTMLInputElement>(null)

    // Normalize accept prop to string for native input
    const acceptString = normalizeAccept(accept)

    const [previews, setPreviews] = useState<ImagePreview[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [sizeError, setSizeError] = useState<string | null>(null)
    const previewsRef = useRef<ImagePreview[]>([])

    // Keep ref in sync with state for cleanup
    useEffect(() => {
      previewsRef.current = previews
    }, [previews])

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      defaultValue: defaultValue as never,
      rules: {
        ...rules,
        required: required ? (rules?.required || true) : rules?.required,
      },
    })

    const showLabel = label !== false
    const displayLabel = label || source

    // Cleanup object URLs on unmount
    useEffect(() => {
      return () => {
        previewsRef.current.forEach((preview) => {
          URL.revokeObjectURL(preview.url)
        })
      }
    }, [])

    /**
     * Validate file size
     */
    const validateFileSize = useCallback(
      (file: File): boolean => {
        if (maxSize && file.size > maxSize) {
          setSizeError(`File size exceeds ${formatFileSize(maxSize)} limit`)
          return false
        }
        setSizeError(null)
        return true
      },
      [maxSize]
    )

    /**
     * Process files and create previews
     */
    const processFiles = useCallback(
      (files: FileList | File[]) => {
        const fileArray = Array.from(files)
        const validFiles: File[] = []
        let hasError = false

        for (const file of fileArray) {
          if (!validateFileSize(file)) {
            hasError = true
            continue
          }
          validFiles.push(file)
        }

        if (validFiles.length === 0 && hasError) {
          return
        }

        // Revoke old URLs
        previews.forEach((preview) => {
          URL.revokeObjectURL(preview.url)
        })

        const newPreviews = validFiles.map((file) => ({
          id: generatePreviewId(),
          url: URL.createObjectURL(file),
          file,
        }))

        if (multiple) {
          setPreviews((prev) => {
            // Revoke old URLs if replacing
            prev.forEach((p) => URL.revokeObjectURL(p.url))
            return newPreviews
          })
          field.onChange(validFiles)
        } else {
          setPreviews(newPreviews.slice(0, 1))
          field.onChange(validFiles[0] || null)
        }
      },
      [multiple, field, validateFileSize, previews]
    )

    /**
     * Handle file input change
     */
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
          processFiles(files)
        }
      },
      [processFiles]
    )

    /**
     * Handle drag events
     */
    const handleDragEnter = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if (!disabled) {
          setIsDragging(true)
        }
      },
      [disabled]
    )

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)
    }, [])

    const handleDragOver = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if (!disabled) {
          setIsDragging(true)
        }
      },
      [disabled]
    )

    const handleDrop = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)

        if (disabled) return

        const files = event.dataTransfer?.files
        if (files && files.length > 0) {
          // Filter to only image files
          const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith('image/')
          )
          if (imageFiles.length > 0) {
            processFiles(imageFiles)
          }
        }
      },
      [disabled, processFiles]
    )

    /**
     * Remove an image from the preview
     */
    const handleRemove = useCallback(
      (index: number) => {
        setPreviews((prev) => {
          const removed = prev[index]
          if (removed) {
            URL.revokeObjectURL(removed.url)
          }
          const newPreviews = prev.filter((_, i) => i !== index)

          // Update form value
          if (multiple) {
            const newFiles = newPreviews.map((p) => p.file)
            field.onChange(newFiles.length > 0 ? newFiles : null)
          } else {
            field.onChange(null)
          }

          return newPreviews
        })
        setSizeError(null)
      },
      [multiple, field]
    )

    /**
     * Handle click on dropzone to open file picker
     */
    const handleDropzoneClick = useCallback(() => {
      if (!disabled && inputRef.current) {
        inputRef.current.click()
      }
    }, [disabled])

    /**
     * Handle keyboard activation
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault()
          inputRef.current?.click()
        }
      },
      [disabled]
    )

    const displayError = error?.message || sizeError

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {showLabel && (
          <label htmlFor={inputId} className={labelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* Hidden file input */}
        <input
          {...rest}
          ref={(e) => {
            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = e
            field.ref(e)
            if (typeof ref === 'function') {
              ref(e)
            } else if (ref) {
              ref.current = e
            }
          }}
          id={inputId}
          name={field.name}
          type="file"
          accept={acceptString}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-invalid={displayError ? 'true' : undefined}
          aria-describedby={
            displayError ? errorId : helperText ? helperId : undefined
          }
        />

        {/* Drop zone */}
        <div
          data-testid="image-input-dropzone"
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleDropzoneClick}
          onKeyDown={handleKeyDown}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2',
            'min-h-32 rounded-lg border-2 border-dashed',
            'transition-colors duration-200',
            'border-input bg-background',
            isDragging && 'border-ring bg-accent',
            displayError && 'border-destructive',
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:border-ring hover:bg-accent/50',
            className
          )}
        >
          {previews.length === 0 ? (
            <>
              <svg
                className="h-10 w-10 text-muted-foreground"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to {maxSize ? formatFileSize(maxSize) : '10MB'}
                </p>
              </div>
            </>
          ) : (
            <div
              className={cn(
                'w-full p-4',
                multiple ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4' : ''
              )}
            >
              {previews.map((preview, index) => (
                <div
                  key={preview.id}
                  className="relative group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    {preview.file.name}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(index)
                    }}
                    className={cn(
                      'absolute -top-2 -right-2 p-1 rounded-full',
                      'bg-destructive text-destructive-foreground',
                      'opacity-0 group-hover:opacity-100 transition-opacity',
                      'hover:bg-destructive/90 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring'
                    )}
                    aria-label={`Remove ${preview.file.name}`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {helperText && !displayError && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        {displayError && (
          <p id={errorId} className="text-sm text-destructive">
            {displayError}
          </p>
        )}
      </div>
    )
  }
)

ImageInput.displayName = 'ImageInput'
