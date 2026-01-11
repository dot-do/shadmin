import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  Show,
} from 'shadmin'
import type { Log } from '../../dataProvider'
import { CodeSnippet } from '../../components/CodeSnippet'

// Render helpers
const renderMethodBadge = (method: string) => {
  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    PATCH: 'bg-orange-100 text-orange-800',
    DELETE: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${colors[method] || 'bg-gray-100 text-gray-800'}`}>
      {method}
    </span>
  )
}

const renderStatusCodeBadge = (statusCode: number) => {
  let colorClass = 'bg-green-100 text-green-800'
  if (statusCode >= 400 && statusCode < 500) {
    colorClass = 'bg-yellow-100 text-yellow-800'
  } else if (statusCode >= 500) {
    colorClass = 'bg-red-100 text-red-800'
  } else if (statusCode >= 300) {
    colorClass = 'bg-blue-100 text-blue-800'
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${colorClass}`}>{statusCode}</span>
  )
}

const renderResponseTime = (ms: number) => {
  const colorClass = ms > 300 ? 'text-red-600' : ms > 150 ? 'text-yellow-600' : 'text-green-600'
  return <span className={`font-mono text-sm ${colorClass}`}>{ms}ms</span>
}

export const LogList = () => (
  <List>
    <Datagrid rowClick="show">
      <DateField source="timestamp" showTime />
      <FunctionField
        render={(record) => {
          const r = record as Log | undefined
          return r ? renderMethodBadge(r.method) : null
        }}
      />
      <FunctionField
        render={(record) => {
          const r = record as Log | undefined
          return r ? <span className="font-mono text-sm">{r.endpoint}</span> : null
        }}
      />
      <FunctionField
        render={(record) => {
          const r = record as Log | undefined
          return r ? renderStatusCodeBadge(r.statusCode) : null
        }}
      />
      <FunctionField
        render={(record) => {
          const r = record as Log | undefined
          return r ? renderResponseTime(r.responseTime) : null
        }}
      />
      <TextField source="apiKeyName" />
      <FunctionField
        render={(record) => {
          const r = record as Log | undefined
          return r ? <span className="font-mono text-sm text-gray-500">{r.ip}</span> : null
        }}
      />
    </Datagrid>
  </List>
)

export const LogShow = () => (
  <Show>
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Timestamp</label>
          <DateField source="timestamp" showTime />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Method</label>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              return r ? renderMethodBadge(r.method) : null
            }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Status</label>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              return r ? renderStatusCodeBadge(r.statusCode) : null
            }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Response Time</label>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              return r ? renderResponseTime(r.responseTime) : null
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Endpoint</label>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              return r ? <span className="font-mono text-sm">{r.endpoint}</span> : null
            }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">API Key</label>
          <TextField source="apiKeyName" />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">IP Address</label>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              return r ? <span className="font-mono text-sm">{r.ip}</span> : null
            }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">User Agent</label>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              return r ? <span className="text-sm text-gray-600 truncate block">{r.userAgent}</span> : null
            }}
          />
        </div>
      </div>

      <FunctionField
        render={(record) => {
          const r = record as Log | undefined
          return r?.error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <label className="text-sm font-medium text-red-800 block mb-1">Error</label>
              <span className="text-red-700">{r.error}</span>
            </div>
          ) : null
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Request Body</h4>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              if (!r) return null
              return (
                <CodeSnippet
                  language="json"
                  code={r.requestBody ? JSON.stringify(JSON.parse(r.requestBody), null, 2) : 'No request body'}
                />
              )
            }}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Response Body</h4>
          <FunctionField
            render={(record) => {
              const r = record as Log | undefined
              if (!r) return null
              return (
                <CodeSnippet
                  language="json"
                  code={r.responseBody ? JSON.stringify(JSON.parse(r.responseBody), null, 2) : 'No response body'}
                />
              )
            }}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-sm font-semibold mb-2">cURL Command to Reproduce</h4>
        <FunctionField
          render={(record) => {
            const r = record as Log | undefined
            if (!r) return null
            return (
              <CodeSnippet
                language="bash"
                code={`curl -X ${r.method} "https://api.example.com.ai${r.endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"${r.requestBody ? ` \\
  -d '${r.requestBody}'` : ''}`}
              />
            )
          }}
        />
      </div>
    </div>
  </Show>
)
