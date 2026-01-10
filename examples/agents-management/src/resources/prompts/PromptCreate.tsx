/**
 * PromptCreate - Create form for new prompts
 */

import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  useCreateContext,
} from 'shadmin'

const categoryChoices = [
  { id: 'system', name: 'System' },
  { id: 'user', name: 'User' },
  { id: 'template', name: 'Template' },
]

const defaultValues = {
  name: '',
  description: '',
  content: '',
  category: 'template',
  variables: [],
  isDefault: false,
  usageCount: 0,
}

function PromptCreateForm() {
  const { save } = useCreateContext()

  // Extract variables from content on save
  const handleSave = (data: Record<string, unknown>) => {
    const content = data.content as string
    const variableRegex = /\{\{(\w+)\}\}/g
    const variables: string[] = []
    let match

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    return save?.({ ...data, variables })
  }

  return (
    <SimpleForm
      onSubmit={handleSave}
      defaultValues={defaultValues}
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
            Use {`{{variable_name}}`} syntax for template variables. Variables will be automatically extracted.
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

export function PromptCreate() {
  return (
    <Create resource="prompts" title="Create Prompt">
      <PromptCreateForm />
    </Create>
  )
}

export default PromptCreate
