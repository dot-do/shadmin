/**
 * PromptShow - Show view for prompt details
 */

import {
  Show,
  useRecordContext,
} from 'shadmin'
import type { Prompt } from '../../dataProvider'

const categoryColors: Record<string, string> = {
  system: 'bg-purple-100 text-purple-800',
  user: 'bg-blue-100 text-blue-800',
  template: 'bg-green-100 text-green-800',
}

function PromptShowContent() {
  const record = useRecordContext<Prompt>()

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
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              categoryColors[record.category] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {record.category}
          </span>
          {record.isDefault && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Default
            </span>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Usage Count</div>
          <div className="text-2xl font-bold">{record.usageCount.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Created</div>
          <div className="text-sm font-medium">
            {new Date(record.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Last Updated</div>
          <div className="text-sm font-medium">
            {new Date(record.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Variables */}
      {record.variables.length > 0 && (
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground mb-2">Variables</div>
          <div className="flex flex-wrap gap-2">
            {record.variables.map((variable) => (
              <span
                key={variable}
                className="inline-flex items-center px-3 py-1 rounded-md bg-muted text-sm font-mono"
              >
                {`{{${variable}}}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="text-sm text-muted-foreground mb-2">Prompt Content</div>
        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
          {record.content}
        </pre>
      </div>
    </div>
  )
}

export function PromptShow() {
  return (
    <Show resource="prompts" title="Prompt Details">
      <PromptShowContent />
    </Show>
  )
}

export default PromptShow
