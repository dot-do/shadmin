/**
 * ConversationShow - Show view for conversation with message history
 */

import {
  Show,
  TextField,
  DateField,
  ReferenceField,
  useRecordContext,
} from 'shadmin'
import type { Conversation, Message } from '../../dataProvider'

const statusColors: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isSystem
            ? 'bg-yellow-50 border border-yellow-200 text-yellow-900'
            : isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div className="text-xs text-muted-foreground mb-1 capitalize">
          {message.role}
          {message.tokensUsed && (
            <span className="ml-2">({message.tokensUsed} tokens)</span>
          )}
        </div>
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

function ConversationShowContent() {
  const record = useRecordContext<Conversation>()

  if (!record) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{record.title}</h2>
          <p className="text-muted-foreground">User: {record.userId}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[record.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {record.status}
        </span>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Messages</div>
          <div className="text-2xl font-bold">{record.messageCount}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Tokens Used</div>
          <div className="text-2xl font-bold">{record.tokensUsed.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Started</div>
          <div className="text-sm font-medium">
            {new Date(record.startedAt).toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Last Message</div>
          <div className="text-sm font-medium">
            {new Date(record.lastMessageAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Conversation History</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {record.messages && record.messages.length > 0 ? (
            record.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No messages in this conversation
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ConversationShow() {
  return (
    <Show resource="conversations" title="Conversation Details">
      <ConversationShowContent />
    </Show>
  )
}

export default ConversationShow
