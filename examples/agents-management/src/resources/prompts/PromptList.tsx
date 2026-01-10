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

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    system: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    template: 'bg-green-100 text-green-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
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
        <FunctionField
          render={(record) => {
            const r = record as Prompt | undefined
            if (!r) return null
            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(r.category)}`}>
                {r.category}
              </span>
            )
          }}
        />
        <FunctionField
          render={(record) => {
            const r = record as Prompt | undefined
            if (!r) return null
            return (
              <span className="text-sm text-muted-foreground">
                {r.variables.length > 0 ? r.variables.join(', ') : 'None'}
              </span>
            )
          }}
        />
        <FunctionField
          render={(record) => {
            const r = record as Prompt | undefined
            return r?.isDefault ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                Default
              </span>
            ) : null
          }}
        />
        <NumberField source="usageCount" />
        <DateField source="updatedAt" />
      </Datagrid>
    </List>
  )
}

export default PromptList
