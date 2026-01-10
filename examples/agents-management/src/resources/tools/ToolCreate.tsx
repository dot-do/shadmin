/**
 * ToolCreate - Create form for new tools
 */

import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  useCreateContext,
} from 'shadmin'

const typeChoices = [
  { id: 'function', name: 'Function' },
  { id: 'retrieval', name: 'Retrieval' },
  { id: 'code_interpreter', name: 'Code Interpreter' },
]

const defaultSchema = JSON.stringify({
  type: 'function',
  function: {
    name: 'my_function',
    description: 'Description of what this function does',
    parameters: {
      type: 'object',
      properties: {
        param1: { type: 'string', description: 'First parameter' },
      },
      required: ['param1'],
    },
  },
}, null, 2)

const defaultValues = {
  name: '',
  description: '',
  type: 'function',
  schema: defaultSchema,
  enabled: true,
  usageCount: 0,
}

function ToolCreateForm() {
  const { save } = useCreateContext()

  return (
    <SimpleForm
      onSubmit={save}
      defaultValues={defaultValues}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              source="name"
              label="Tool Name"
              required
            />
            <SelectInput
              source="type"
              label="Type"
              choices={typeChoices}
            />
          </div>
          <TextInput
            source="description"
            label="Description"
          />
          <BooleanInput
            source="enabled"
            label="Enabled"
          />
        </div>

        {/* Schema */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tool Schema</h3>
          <TextInput
            source="schema"
            label="Schema (JSON)"
            multiline
            className="min-h-[300px] font-mono"
          />
        </div>
      </div>
    </SimpleForm>
  )
}

export function ToolCreate() {
  return (
    <Create resource="tools" title="Create Tool">
      <ToolCreateForm />
    </Create>
  )
}

export default ToolCreate
