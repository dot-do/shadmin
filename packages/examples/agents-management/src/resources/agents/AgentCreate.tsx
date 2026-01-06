/**
 * AgentCreate - Create form for new AI agents
 */

import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  SelectArrayInput,
  useCreateContext,
} from 'shadmin'

const modelChoices = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
]

const statusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'draft', name: 'Draft' },
]

const toolChoices = [
  { id: 1, name: 'search_knowledge_base' },
  { id: 2, name: 'get_order_status' },
  { id: 3, name: 'code_executor' },
  { id: 4, name: 'get_product_catalog' },
  { id: 5, name: 'query_database' },
]

const defaultValues = {
  name: '',
  description: '',
  model: 'claude-3-5-sonnet',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '',
  tools: [],
  status: 'draft',
  conversationCount: 0,
  totalTokensUsed: 0,
}

function AgentCreateForm() {
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
              label="Agent Name"
              required
            />
            <SelectInput
              source="status"
              label="Status"
              choices={statusChoices}
            />
          </div>
          <TextInput
            source="description"
            label="Description"
          />
        </div>

        {/* Model Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Model Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectInput
              source="model"
              label="Model"
              choices={modelChoices}
            />
            <NumberInput
              source="temperature"
              label="Temperature"
              min={0}
              max={2}
              step={0.1}
            />
            <NumberInput
              source="maxTokens"
              label="Max Tokens"
              min={256}
              max={32768}
              step={256}
            />
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tools</h3>
          <SelectArrayInput
            source="tools"
            label="Available Tools"
            choices={toolChoices}
          />
        </div>

        {/* System Prompt */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">System Prompt</h3>
          <TextInput
            source="systemPrompt"
            label="System Prompt"
            multiline
            className="min-h-[200px]"
          />
        </div>
      </div>
    </SimpleForm>
  )
}

export function AgentCreate() {
  return (
    <Create resource="agents" title="Create Agent">
      <AgentCreateForm />
    </Create>
  )
}

export default AgentCreate
