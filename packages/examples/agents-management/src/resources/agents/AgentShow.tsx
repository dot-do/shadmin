/**
 * AgentShow - Show view for AI agent details
 */

import {
  Show,
  useRecordContext,
} from 'shadmin'
import type { Agent } from '../../dataProvider'

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  draft: 'bg-yellow-100 text-yellow-800',
}

function AgentShowContent() {
  const record = useRecordContext<Agent>()

  if (!record) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{record.name}</h2>
          <p className="text-muted-foreground">{record.description}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[record.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {record.status}
        </span>
      </div>

      {/* Model Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Model</div>
          <div className="text-lg font-semibold">{record.model}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Temperature</div>
          <div className="text-lg font-semibold">{record.temperature}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Max Tokens</div>
          <div className="text-lg font-semibold">{record.maxTokens.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Tools</div>
          <div className="text-lg font-semibold">{record.tools.length}</div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Total Conversations</div>
          <div className="text-2xl font-bold">{record.conversationCount.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Total Tokens Used</div>
          <div className="text-2xl font-bold">{(record.totalTokensUsed / 1000000).toFixed(2)}M</div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="text-sm text-muted-foreground mb-2">System Prompt</div>
        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
          {record.systemPrompt}
        </pre>
      </div>

      {/* Timestamps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div>
          <span className="font-medium">Created:</span>{' '}
          {new Date(record.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="font-medium">Last Updated:</span>{' '}
          {new Date(record.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export function AgentShow() {
  return (
    <Show resource="agents" title="Agent Details">
      <AgentShowContent />
    </Show>
  )
}

export default AgentShow
