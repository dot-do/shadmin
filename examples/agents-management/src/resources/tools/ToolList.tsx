/**
 * ToolList - List view for AI tools
 */

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
} from 'shadmin'
import type { Tool } from '../../dataProvider'

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    function: 'bg-purple-100 text-purple-800',
    retrieval: 'bg-blue-100 text-blue-800',
    code_interpreter: 'bg-orange-100 text-orange-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export function ToolList() {
  return (
    <List
      resource="tools"
      title="Tools"
      perPage={10}
      sort={{ field: 'usageCount', order: 'DESC' }}
    >
      <Datagrid rowClick="show" hover>
        <TextField source="name" />
        <TextField source="description" />
        <FunctionField
          render={(record) => {
            const r = record as Tool | undefined
            if (!r) return null
            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(r.type)}`}>
                {r.type.replace('_', ' ')}
              </span>
            )
          }}
        />
        <FunctionField
          render={(record) => {
            const r = record as Tool | undefined
            if (!r) return null
            return (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${r.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {r.enabled ? 'Enabled' : 'Disabled'}
              </span>
            )
          }}
        />
        <NumberField source="usageCount" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  )
}

export default ToolList
