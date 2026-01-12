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
 * @typeParam TChoice - The type of choice being created (defaults to unknown for maximum flexibility)
 */
export interface CreateSuggestionContextValue<TChoice = unknown> {
  /**
   * The current filter/search text entered by the user
   */
  filter?: string
  /**
   * Callback to create a new choice with the given value
   * @param choice - The new choice to create
   */
  onCreate: (choice: TChoice) => void
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
 * @typeParam TChoice - The type of choice being created
 * @throws Error if used outside of a CreateSuggestionContext.Provider
 *
 * @example
 * ```tsx
 * import { useCreateSuggestionContext, Create, SimpleForm, TextInput } from 'shadmin';
 * import { Dialog, DialogContent, DialogTitle } from '@shadcn/ui';
 *
 * interface Author {
 *   id: number;
 *   name: string;
 * }
 *
 * const CreateAuthor = () => {
 *   const { filter, onCancel, onCreate } = useCreateSuggestionContext<Author>();
 *
 *   const handleSubmit = (data: { name: string }) => {
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
export function useCreateSuggestionContext<TChoice = unknown>(): CreateSuggestionContextValue<TChoice> {
  const context = useContext(CreateSuggestionContext)
  if (!context) {
    throw new Error(
      'useCreateSuggestionContext must be used inside a CreateSuggestionContext.Provider'
    )
  }
  // Cast is safe: Context stores generic choice type, caller specifies expected type
  // The generic parameter allows consumers to type-narrow the onCreate callback
  return context as CreateSuggestionContextValue<TChoice>
}
