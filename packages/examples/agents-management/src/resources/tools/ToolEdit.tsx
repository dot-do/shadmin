/**
 * ToolEdit - Edit form for tools
 */

import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  useEditContext,
} from 'shadmin'

const typeChoices = [
  { id: 'function', name: 'Function' },
  { id: 'retrieval', name: 'Retrieval' },
  { id: 'code_interpreter', name: 'Code Interpreter' },
]

function ToolEditForm() {
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

export function ToolEdit() {
  return (
    <Edit resource="tools" title="Edit Tool">
      <ToolEditForm />
    </Edit>
  )
}

export default ToolEdit
