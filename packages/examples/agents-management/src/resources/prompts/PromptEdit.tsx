/**
 * PromptEdit - Edit form for prompts
 */

import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  useEditContext,
} from 'shadmin'

const categoryChoices = [
  { id: 'system', name: 'System' },
  { id: 'user', name: 'User' },
  { id: 'template', name: 'Template' },
]

function PromptEditForm() {
  const { record, save, isLoading } = useEditContext()

  if (isLoading || !record) {
    return <div>Loading...</div>
  }

  return (
    <SimpleForm
      onSubmit={save}
      defaultValues={record}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              source="name"
              label="Prompt Name"
              required
            />
            <SelectInput
              source="category"
              label="Category"
              choices={categoryChoices}
            />
          </div>
          <TextInput
            source="description"
            label="Description"
          />
          <BooleanInput
            source="isDefault"
            label="Set as Default"
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prompt Content</h3>
          <p className="text-sm text-muted-foreground">
            Use {`{{variable_name}}`} syntax for template variables
          </p>
          <TextInput
            source="content"
            label="Content"
            multiline
            className="min-h-[300px]"
          />
        </div>
      </div>
    </SimpleForm>
  )
}

export function PromptEdit() {
  return (
    <Edit resource="prompts" title="Edit Prompt">
      <PromptEditForm />
    </Edit>
  )
}

export default PromptEdit
