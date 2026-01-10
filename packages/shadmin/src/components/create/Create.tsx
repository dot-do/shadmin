/**
 * Create Component
 * Complete create component combining CreateBase (logic) and CreateView (UI)
 * 100% API-compatible with react-admin Create
 *
 * Epic: shadmin-ha1 (P1)
 */

import type { ReactNode } from 'react'
import { CreateBase, type CreateBaseProps, type TransformData } from './CreateBase'
import { CreateView, type CreateViewProps } from './CreateView'
import type { RaRecord } from '../../facade'
import type { RedirectTo } from '../../hooks/useRedirect'

/**
 * Props for Create component
 * Combines CreateBase props (logic) with CreateView props (UI)
 */
export interface CreateProps<
  RecordType extends RaRecord = RaRecord,
  TData = Record<string, unknown>,
> extends Omit<CreateBaseProps<RecordType, TData>, 'children'>,
    Pick<CreateViewProps, 'actions' | 'className' | 'aside'> {
  /** Child elements to render inside the create form (typically SimpleForm) */
  children: ReactNode
  /** Title to display in the create header */
  title?: ReactNode
}

/**
 * Create - Complete create component with form handling and UI
 *
 * The Create component combines CreateBase (form submission, redirect, notifications)
 * with CreateView (Card container, header) to provide a complete create solution.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Create resource="posts">
 *   <SimpleForm>
 *     <TextInput source="title" />
 *     <TextInput source="body" multiline />
 *   </SimpleForm>
 * </Create>
 *
 * // With all options
 * <Create
 *   resource="posts"
 *   title="Create New Post"
 *   redirect="show"
 *   transform={(data) => ({ ...data, createdAt: new Date() })}
 *   mutationOptions={{ onSuccess: () => console.log('Created!') }}
 * >
 *   <SimpleForm>
 *     <TextInput source="title" />
 *     <TextInput source="body" multiline />
 *   </SimpleForm>
 * </Create>
 * ```
 */
export function Create<
  RecordType extends RaRecord = RaRecord,
  TData = Record<string, unknown>,
>({
  // CreateBase props
  resource,
  redirect,
  transform,
  mutationOptions,
  disableSuccessNotification,
  disableErrorNotification,
  // CreateView props
  title,
  actions,
  className,
  aside,
  // Children
  children,
}: CreateProps<RecordType, TData>) {
  return (
    <CreateBase<RecordType, TData>
      resource={resource}
      redirect={redirect}
      transform={transform}
      mutationOptions={mutationOptions}
      disableSuccessNotification={disableSuccessNotification}
      disableErrorNotification={disableErrorNotification}
    >
      <CreateView title={title} actions={actions} className={className} aside={aside}>
        {children}
      </CreateView>
    </CreateBase>
  )
}

export default Create

// Re-export types for convenience
export type { RedirectTo, TransformData }
