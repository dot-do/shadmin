/**
 * FileInput Component
 * A form input component for file selection with drag-and-drop support
 * that integrates with react-hook-form
 */

import { forwardRef, useId, useState, useRef, useCallback, type InputHTMLAttributes, type DragEvent } from 'react'
import { useController, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Props for FileInput component
 */
export interface FileInputProps<T extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'type' | 'value'> {
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
   * Additional props passed directly to the input element.
   */
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  /**
   * Whether the input should take full width of its container.
   */
  fullWidth?: boolean
}

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Drop zone styling based on ShadCN patterns with dashed border.
 */
const dropZoneStyles = cn(
  'flex flex-col items-center justify-center w-full min-h-32 px-4 py-6',
  'border-2 border-dashed border-input rounded-lg',
  'bg-background cursor-pointer',
  'transition-colors duration-200',
  'hover:border-muted-foreground hover:bg-accent/50'
)

const dropZoneActiveStyles = 'border-primary bg-accent drag-active'

const dropZoneDisabledStyles = 'cursor-not-allowed opacity-50 hover:border-input hover:bg-background'

const dropZoneErrorStyles = 'border-destructive'

/**
 * FileInput component for form file selection with drag-and-drop support.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FileInput source="avatar" label="Profile Picture" />
 *
 * // With file type restriction
 * <FileInput
 *   source="image"
 *   label="Image"
 *   accept="image/*"
 * />
 *
 * // Multiple file selection
 * <FileInput
 *   source="documents"
 *   label="Documents"
 *   multiple
 *   accept=".pdf,.doc,.docx"
 * />
 *
 * // With validation
 * <FileInput
 *   source="resume"
 *   label="Resume"
 *   rules={{
 *     required: 'Resume is required',
 *     validate: (files) => {
 *       if (files && files[0]?.size > 5000000) {
 *         return 'File must be less than 5MB'
 *       }
 *       return true
 *     },
 *   }}
 * />
 * ```
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      source,
      label,
      helperText,
      rules,
      inputProps,
      fullWidth,
      className,
      disabled,
      required,
      accept,
      multiple,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const inputId = inputProps?.id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isDragActive, setIsDragActive] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      rules: {
        ...rules,
        required: required ? (rules?.required || true) : rules?.required,
      },
    })

    const showLabel = label !== false
    const displayLabel = label || source

    // Update form field with files
    // We store files as File[] array which is more portable than FileList
    const updateFiles = useCallback((files: File[]) => {
      setSelectedFiles(files)
      if (files.length > 0) {
        // Store as File[] for better compatibility
        field.onChange(files)
      } else {
        field.onChange(null)
      }
    }, [field])

    // Handle file input change
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files
      if (fileList) {
        const files = Array.from(fileList)
        updateFiles(files)
      }
    }, [updateFiles])

    // Handle drag events
    const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!disabled) {
        setIsDragActive(true)
      }
    }, [disabled])

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragActive(false)
    }, [])

    const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }, [])

    const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragActive(false)

      if (disabled) return

      const droppedFiles = Array.from(event.dataTransfer.files)
      if (droppedFiles.length === 0) return

      // If not multiple, only take the first file
      const filesToAdd = multiple ? droppedFiles : [droppedFiles[0]]
      updateFiles(filesToAdd)
    }, [disabled, multiple, updateFiles])

    // Handle click on drop zone
    const handleDropZoneClick = useCallback(() => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click()
      }
    }, [disabled])

    // Handle removing a single file
    const handleRemoveFile = useCallback((index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index)
      updateFiles(newFiles)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, [selectedFiles, updateFiles])

    // Handle clearing all files
    const handleClearAll = useCallback(() => {
      updateFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, [updateFiles])

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
          {...inputProps}
          ref={(e) => {
            // Assign to local ref
            (fileInputRef as React.MutableRefObject<HTMLInputElement | null>).current = e
            // Assign to field ref
            field.ref(e)
            // Forward ref if provided
            if (typeof ref === 'function') {
              ref(e)
            } else if (ref) {
              ref.current = e
            }
          }}
          id={inputId}
          name={field.name}
          type="file"
          onChange={handleFileChange}
          onBlur={field.onBlur}
          className="sr-only"
          disabled={disabled}
          required={required}
          accept={accept}
          multiple={multiple}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
        />

        {/* Drop zone */}
        <div
          onClick={handleDropZoneClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            dropZoneStyles,
            isDragActive && dropZoneActiveStyles,
            disabled && dropZoneDisabledStyles,
            error && dropZoneErrorStyles,
            className
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          data-testid="file-drop-zone"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleDropZoneClick()
            }
          }}
        >
          {/* Upload icon */}
          <svg
            className="w-8 h-8 mb-3 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className="mb-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Click to browse</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            {accept ? `Accepted: ${accept}` : 'Any file type'}
            {multiple && ' (multiple files allowed)'}
          </p>
        </div>

        {/* Selected files list */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 text-sm bg-muted rounded-md"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* File icon */}
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="truncate">{file.name}</span>
                  <span className="text-muted-foreground flex-shrink-0">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(index)
                  }}
                  className="p-1 hover:bg-background rounded-sm text-muted-foreground hover:text-foreground"
                  aria-label="Remove file"
                  disabled={disabled}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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

            {/* Clear all button for multiple files */}
            {multiple && selectedFiles.length > 1 && (
              <button
                type="button"
                onClick={handleClearAll}
                className={cn(
                  'text-sm text-muted-foreground hover:text-foreground',
                  'underline-offset-4 hover:underline'
                )}
                disabled={disabled}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error.message}
          </p>
        )}
      </div>
    )
  }
)

FileInput.displayName = 'FileInput'

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
