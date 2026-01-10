/**
 * useCreateSuggestionContext hook
 * Provides context for creating new suggestions in autocomplete inputs
 * 100% API-compatible with react-admin
 *
 * @see https://marmelab.com/react-admin/AutocompleteInput.html
 */

import { createContext, useContext } from 'react'

/**
 * Context value for creating new suggestions
 */
export interface CreateSuggestionContextValue {
  /**
   * The current filter/search text entered by the user
   */
  filter?: string
  /**
   * Callback to create a new choice with the given value
   * @param choice - The new choice to create
   */
  onCreate: (choice: any) => void
  /**
   * Callback to cancel the create operation
   */
  onCancel: () => void
}

/**
 * Context for managing "create new" suggestions in autocomplete inputs.
 * Used by AutocompleteInput to allow creating new options on-the-fly.
 */
export const CreateSuggestionContext = createContext<
  CreateSuggestionContextValue | undefined
>(undefined)

CreateSuggestionContext.displayName = 'CreateSuggestionContext'

/**
 * Hook to access the create suggestion context.
 * Must be used within a CreateSuggestionContext.Provider.
 *
 * @throws Error if used outside of a CreateSuggestionContext.Provider
 *
 * @example
 * ```tsx
 * import { useCreateSuggestionContext, Create, SimpleForm, TextInput } from 'shadmin';
 * import { Dialog, DialogContent, DialogTitle } from '@shadcn/ui';
 *
 * const CreateAuthor = () => {
 *   const { filter, onCancel, onCreate } = useCreateSuggestionContext();
 *
 *   const handleSubmit = (data: any) => {
 *     // Create the author and call onCreate with the result
 *     createAuthor(data).then(onCreate);
 *   };
 *
 *   return (
 *     <Dialog open onOpenChange={(open) => !open && onCancel()}>
 *       <DialogContent>
 *         <DialogTitle>Create Author</DialogTitle>
 *         <SimpleForm onSubmit={handleSubmit} defaultValues={{ name: filter }}>
 *           <TextInput source="name" />
 *         </SimpleForm>
 *       </DialogContent>
 *     </Dialog>
 *   );
 * };
 * ```
 */
export function useCreateSuggestionContext(): CreateSuggestionContextValue {
  const context = useContext(CreateSuggestionContext)
  if (!context) {
    throw new Error(
      'useCreateSuggestionContext must be used inside a CreateSuggestionContext.Provider'
    )
  }
  return context
}
