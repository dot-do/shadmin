/**
 * RichTextInput Component
 * A rich text editor input component that integrates with react-hook-form
 *
 * Uses a minimal contentEditable implementation with basic formatting toolbar.
 * Can be extended with @tiptap/react for full rich text capabilities.
 */

import {
  forwardRef,
  useId,
  useRef,
  useCallback,
  useEffect,
  useState,
  type HTMLAttributes,
} from 'react'
import {
  useController,
  type RegisterOptions,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { useFormContext } from '../../contexts/FormContext'
import { cn } from '../../utils'

/**
 * Props for RichTextInput component
 */
export interface RichTextInputProps<T extends FieldValues = FieldValues>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /**
   * The field name in the form data. Maps to the `name` attribute on the input.
   */
  source: Path<T>
  /**
   * Label text displayed above the editor.
   * If not provided, uses the source field name.
   * Set to `false` to hide the label completely.
   */
  label?: string | false
  /**
   * Helper text displayed below the editor.
   */
  helperText?: string
  /**
   * Validation rules passed to react-hook-form.
   */
  rules?: RegisterOptions<T>
  /**
   * Whether the editor should take full width of its container.
   */
  fullWidth?: boolean
  /**
   * Whether the editor is disabled.
   */
  disabled?: boolean
  /**
   * Whether the field is required.
   */
  required?: boolean
}

/**
 * Label styling based on ShadCN Label component patterns.
 */
const labelStyles = cn(
  'text-sm font-medium leading-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * Editor container styling based on ShadCN Input component patterns.
 */
const editorContainerStyles = cn(
  'rounded-md border border-input bg-background',
  'ring-offset-background',
  'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
)

const errorContainerStyles = 'border-destructive focus-within:ring-destructive'

const disabledContainerStyles = 'cursor-not-allowed opacity-50'

/**
 * Toolbar button styling
 */
const toolbarButtonStyles = cn(
  'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium',
  'ring-offset-background transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50'
)

const activeButtonStyles = 'bg-accent text-accent-foreground'

/**
 * Available formatting commands
 */
type FormatCommand = 'bold' | 'italic' | 'underline' | 'insertOrderedList' | 'insertUnorderedList'
type HeadingLevel = 1 | 2 | 3

interface ToolbarButtonProps {
  command?: FormatCommand
  heading?: HeadingLevel
  icon: React.ReactNode
  label: string
  isActive: boolean
  disabled: boolean
  onClick: () => void
}

function ToolbarButton({
  icon,
  label,
  isActive,
  disabled,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      data-active={isActive}
      className={cn(toolbarButtonStyles, isActive && activeButtonStyles)}
    >
      {icon}
    </button>
  )
}

// Icons for toolbar buttons
const BoldIcon = () => (
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
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
)

const ItalicIcon = () => (
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
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
)

const UnderlineIcon = () => (
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
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
)

const OrderedListIcon = () => (
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
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </svg>
)

const UnorderedListIcon = () => (
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
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1" fill="currentColor" />
    <circle cx="4" cy="12" r="1" fill="currentColor" />
    <circle cx="4" cy="18" r="1" fill="currentColor" />
  </svg>
)

const Heading1Icon = () => (
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
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17 12l3-2v8" />
  </svg>
)

const Heading2Icon = () => (
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
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
  </svg>
)

/**
 * RichTextInput component for form rich text entry.
 * Integrates with react-hook-form through FormContext.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RichTextInput source="content" label="Content" />
 *
 * // With validation
 * <RichTextInput
 *   source="description"
 *   label="Description"
 *   rules={{ required: 'Description is required' }}
 * />
 *
 * // With helper text
 * <RichTextInput
 *   source="bio"
 *   label="Biography"
 *   helperText="Write a short bio about yourself"
 * />
 * ```
 */
export const RichTextInput = forwardRef<HTMLDivElement, RichTextInputProps>(
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
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext()
    const generatedId = useId()
    const editorId = generatedId
    const errorId = `${editorId}-error`
    const helperId = `${editorId}-helper`

    const editorRef = useRef<HTMLDivElement>(null)
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

    const controllerRules = {
      ...rules,
      ...(required ? { required: rules?.required || true } : rules?.required !== undefined ? { required: rules.required } : {}),
    }

    const {
      field,
      fieldState: { error },
    } = useController({
      name: source,
      control,
      ...(Object.keys(controllerRules).length > 0 && { rules: controllerRules }),
    })

    const showLabel = label !== false
    const displayLabel = label || source

    // Initialize editor content from field value
    useEffect(() => {
      if (editorRef.current && field.value !== undefined) {
        // Only set if different to avoid cursor jump
        if (editorRef.current.innerHTML !== field.value) {
          editorRef.current.innerHTML = field.value || ''
        }
      }
    }, [field.value])

    // Update form value on content change
    const handleInput = useCallback(() => {
      if (editorRef.current) {
        const html = editorRef.current.innerHTML
        // Treat empty paragraph or br as empty
        const isEmpty = !html || html === '<br>' || html === '<p><br></p>'
        field.onChange(isEmpty ? '' : html)
      }
    }, [field])

    // Check active formats on selection change
    const updateActiveFormats = useCallback(() => {
      const formats = new Set<string>()

      if (document.queryCommandState('bold')) {
        formats.add('bold')
      }
      if (document.queryCommandState('italic')) {
        formats.add('italic')
      }
      if (document.queryCommandState('underline')) {
        formats.add('underline')
      }
      if (document.queryCommandState('insertOrderedList')) {
        formats.add('orderedList')
      }
      if (document.queryCommandState('insertUnorderedList')) {
        formats.add('unorderedList')
      }

      // Check for headings
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const parentElement = selection.anchorNode?.parentElement
        if (parentElement) {
          const tagName = parentElement.tagName?.toLowerCase()
          if (tagName === 'h1') formats.add('h1')
          if (tagName === 'h2') formats.add('h2')
          if (tagName === 'h3') formats.add('h3')
        }
      }

      setActiveFormats(formats)
    }, [])

    // Execute formatting command
    const execCommand = useCallback((command: FormatCommand) => {
      if (disabled) return

      document.execCommand(command, false)
      editorRef.current?.focus()
      updateActiveFormats()
      handleInput()
    }, [disabled, updateActiveFormats, handleInput])

    // Apply heading
    const applyHeading = useCallback((level: HeadingLevel) => {
      if (disabled) return

      document.execCommand('formatBlock', false, `h${level}`)
      editorRef.current?.focus()
      updateActiveFormats()
      handleInput()
    }, [disabled, updateActiveFormats, handleInput])

    // Handle selection change to update active formats
    useEffect(() => {
      const handleSelectionChange = () => {
        if (document.activeElement === editorRef.current) {
          updateActiveFormats()
        }
      }

      document.addEventListener('selectionchange', handleSelectionChange)
      return () => document.removeEventListener('selectionchange', handleSelectionChange)
    }, [updateActiveFormats])

    return (
      <div
        className={cn('space-y-2', fullWidth && 'w-full')}
        ref={ref}
        data-testid="shadmin-rich-text-input"
      >
        {showLabel && (
          <label htmlFor={editorId} className={labelStyles}>
            {displayLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div
          className={cn(
            'rich-text-editor',
            editorContainerStyles,
            error && errorContainerStyles,
            disabled && disabledContainerStyles,
            className
          )}
        >
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 border-b border-input p-2">
            <ToolbarButton
              command="bold"
              icon={<BoldIcon />}
              label="Bold"
              isActive={activeFormats.has('bold')}
              disabled={!!disabled}
              onClick={() => execCommand('bold')}
            />
            <ToolbarButton
              command="italic"
              icon={<ItalicIcon />}
              label="Italic"
              isActive={activeFormats.has('italic')}
              disabled={!!disabled}
              onClick={() => execCommand('italic')}
            />
            <ToolbarButton
              command="underline"
              icon={<UnderlineIcon />}
              label="Underline"
              isActive={activeFormats.has('underline')}
              disabled={!!disabled}
              onClick={() => execCommand('underline')}
            />

            <div className="mx-1 w-px bg-border" />

            <ToolbarButton
              heading={1}
              icon={<Heading1Icon />}
              label="Heading 1"
              isActive={activeFormats.has('h1')}
              disabled={!!disabled}
              onClick={() => applyHeading(1)}
            />
            <ToolbarButton
              heading={2}
              icon={<Heading2Icon />}
              label="Heading 2"
              isActive={activeFormats.has('h2')}
              disabled={!!disabled}
              onClick={() => applyHeading(2)}
            />

            <div className="mx-1 w-px bg-border" />

            <ToolbarButton
              command="insertUnorderedList"
              icon={<UnorderedListIcon />}
              label="Unordered List"
              isActive={activeFormats.has('unorderedList')}
              disabled={!!disabled}
              onClick={() => execCommand('insertUnorderedList')}
            />
            <ToolbarButton
              command="insertOrderedList"
              icon={<OrderedListIcon />}
              label="Ordered List"
              isActive={activeFormats.has('orderedList')}
              disabled={!!disabled}
              onClick={() => execCommand('insertOrderedList')}
            />
          </div>

          {/* Editor area */}
          <div
            ref={editorRef}
            id={editorId}
            role="textbox"
            aria-label={typeof displayLabel === 'string' ? displayLabel : source}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            contentEditable={!disabled}
            onInput={handleInput}
            onBlur={() => {
              field.onBlur()
              handleInput()
            }}
            className={cn(
              'editor-container min-h-[150px] p-3 text-sm',
              'focus:outline-none',
              'prose prose-sm max-w-none',
              '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
              error && 'border-destructive'
            )}
            suppressContentEditableWarning
            {...rest}
          />
        </div>

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

RichTextInput.displayName = 'RichTextInput'
