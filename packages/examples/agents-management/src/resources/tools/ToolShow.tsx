/**
 * ToolShow - Show view for tool details
 */

import {
  Show,
  useRecordContext,
} from 'shadmin'
import type { Tool } from '../../dataProvider'

const typeColors: Record<string, string> = {
  function: 'bg-purple-100 text-purple-800',
  retrieval: 'bg-blue-100 text-blue-800',
  code_interpreter: 'bg-orange-100 text-orange-800',
}

function ToolShowContent() {
  const record = useRecordContext<Tool>()

  if (!record) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">{record.name}</h2>
          <p className="text-muted-foreground">{record.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              typeColors[record.type] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {record.type.replace('_', ' ')}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              record.enabled
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {record.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Total Usage</div>
          <div className="text-2xl font-bold">{record.usageCount.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Created</div>
          <div className="text-lg font-semibold">
            {new Date(record.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Schema */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="text-sm text-muted-foreground mb-2">Tool Schema (JSON)</div>
        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-x-auto font-mono">
          {record.schema}
        </pre>
      </div>
    </div>
  )
}

export function ToolShow() {
  return (
    <Show resource="tools" title="Tool Details">
      <ToolShowContent />
    </Show>
  )
}

export default ToolShow
