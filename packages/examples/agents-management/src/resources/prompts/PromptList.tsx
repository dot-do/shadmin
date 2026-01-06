/**
 * PromptList - List view for prompts
 */

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
} from 'shadmin'
import type { Prompt } from '../../dataProvider'

const categoryColors: Record<string, string> = {
  system: 'bg-purple-100 text-purple-800',
  user: 'bg-blue-100 text-blue-800',
  template: 'bg-green-100 text-green-800',
}

export function PromptList() {
  return (
    <List
      resource="prompts"
      title="Prompts"
      perPage={10}
      sort={{ field: 'usageCount', order: 'DESC' }}
    >
      <Datagrid rowClick="show" hover>
        <TextField source="name" />
        <TextField source="description" />
        <FunctionField<Prompt>
          source="category"
          render={(record) => (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                categoryColors[record.category] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {record.category}
            </span>
          )}
        />
        <FunctionField<Prompt>
          source="variables"
          render={(record) => (
            <span className="text-sm text-muted-foreground">
              {record.variables.length > 0
                ? record.variables.join(', ')
                : 'None'}
            </span>
          )}
        />
        <FunctionField<Prompt>
          source="isDefault"
          render={(record) =>
            record.isDefault ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                Default
              </span>
            ) : null
          }
        />
        <NumberField source="usageCount" />
        <DateField source="updatedAt" />
      </Datagrid>
    </List>
  )
}

export default PromptList
