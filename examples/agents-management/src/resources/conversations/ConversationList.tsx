/**
 * ConversationList - List view for conversations
 */

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  ReferenceField,
} from 'shadmin'
import type { Conversation } from '../../dataProvider'

const statusColors: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
}

export function ConversationList() {
  return (
    <List
      resource="conversations"
      title="Conversations"
      perPage={10}
      sort={{ field: 'lastMessageAt', order: 'DESC' }}
    >
      <Datagrid rowClick="show" hover>
        <TextField source="title" />
        <ReferenceField source="agentId" reference="agents">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="userId" />
        <FunctionField<Conversation>
          source="status"
          render={(record) => (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[record.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {record.status}
            </span>
          )}
        />
        <NumberField source="messageCount" />
        <NumberField source="tokensUsed" />
        <DateField source="lastMessageAt" />
      </Datagrid>
    </List>
  )
}

export default ConversationList
