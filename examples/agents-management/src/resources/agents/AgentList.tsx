/**
 * AgentList - List view for AI agents
 */

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
} from 'shadmin'
import type { Agent } from '../../dataProvider'

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function AgentList() {
  return (
    <List
      resource="agents"
      title="AI Agents"
      perPage={10}
      sort={{ field: 'updatedAt', order: 'DESC' }}
    >
      <Datagrid rowClick="show" hover>
        <TextField source="name" />
        <TextField source="model" />
        <FunctionField
          render={(record) => {
            const r = record as Agent | undefined
            if (!r) return null
            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                {r.status}
              </span>
            )
          }}
        />
        <NumberField source="conversationCount" />
        <FunctionField
          render={(record) => {
            const r = record as Agent | undefined
            return r ? <span>{(r.totalTokensUsed / 1000000).toFixed(2)}M</span> : null
          }}
        />
        <DateField source="updatedAt" />
      </Datagrid>
    </List>
  )
}

export default AgentList
