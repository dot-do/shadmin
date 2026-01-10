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

// HTTP Method badge
const MethodBadge = ({ method }: { method: string }) => {
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

// Status code badge
const StatusCodeBadge = ({ statusCode }: { statusCode: number }) => {
  let colorClass = 'bg-green-100 text-green-800'

  if (statusCode >= 400 && statusCode < 500) {
    colorClass = 'bg-yellow-100 text-yellow-800'
  } else if (statusCode >= 500) {
    colorClass = 'bg-red-100 text-red-800'
  } else if (statusCode >= 300) {
    colorClass = 'bg-blue-100 text-blue-800'
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${colorClass}`}>
      {statusCode}
    </span>
  )
}

// Response time indicator
const ResponseTime = ({ ms }: { ms: number }) => {
  let colorClass = 'text-green-600'

  if (ms > 300) {
    colorClass = 'text-red-600'
  } else if (ms > 150) {
    colorClass = 'text-yellow-600'
  }

  return (
    <span className={`font-mono text-sm ${colorClass}`}>
      {ms}ms
    </span>
  )
}

export const LogList = () => (
  <List
    filters={[
      { source: 'method', alwaysOn: true },
      { source: 'statusCode', alwaysOn: true },
      { source: 'endpoint', alwaysOn: true },
      { source: 'apiKeyName', alwaysOn: true },
    ]}
  >
    <Datagrid rowClick="show">
      <DateField source="timestamp" showTime />
      <FunctionField<Log>
        source="method"
        render={(record) => <MethodBadge method={record.method} />}
      />
      <FunctionField<Log>
        source="endpoint"
        render={(record) => (
          <span className="font-mono text-sm">{record.endpoint}</span>
        )}
      />
      <FunctionField<Log>
        source="statusCode"
        render={(record) => <StatusCodeBadge statusCode={record.statusCode} />}
      />
      <FunctionField<Log>
        source="responseTime"
        render={(record) => <ResponseTime ms={record.responseTime} />}
      />
      <TextField source="apiKeyName" />
      <FunctionField<Log>
        source="ip"
        render={(record) => (
          <span className="font-mono text-sm text-gray-500">{record.ip}</span>
        )}
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
          <FunctionField<Log>
            source="method"
            render={(record) => <MethodBadge method={record.method} />}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Status</label>
          <FunctionField<Log>
            source="statusCode"
            render={(record) => <StatusCodeBadge statusCode={record.statusCode} />}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Response Time</label>
          <FunctionField<Log>
            source="responseTime"
            render={(record) => <ResponseTime ms={record.responseTime} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Endpoint</label>
          <FunctionField<Log>
            source="endpoint"
            render={(record) => (
              <span className="font-mono text-sm">{record.endpoint}</span>
            )}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">API Key</label>
          <TextField source="apiKeyName" />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">IP Address</label>
          <FunctionField<Log>
            source="ip"
            render={(record) => (
              <span className="font-mono text-sm">{record.ip}</span>
            )}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">User Agent</label>
          <FunctionField<Log>
            source="userAgent"
            render={(record) => (
              <span className="text-sm text-gray-600 truncate block">{record.userAgent}</span>
            )}
          />
        </div>
      </div>

      <FunctionField<Log>
        render={(record) => record.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <label className="text-sm font-medium text-red-800 block mb-1">Error</label>
            <span className="text-red-700">{record.error}</span>
          </div>
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Request Body</h4>
          <FunctionField<Log>
            render={(record) => (
              <CodeSnippet
                language="json"
                code={record.requestBody ? JSON.stringify(JSON.parse(record.requestBody), null, 2) : 'No request body'}
              />
            )}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Response Body</h4>
          <FunctionField<Log>
            render={(record) => (
              <CodeSnippet
                language="json"
                code={record.responseBody ? JSON.stringify(JSON.parse(record.responseBody), null, 2) : 'No response body'}
              />
            )}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-sm font-semibold mb-2">cURL Command to Reproduce</h4>
        <FunctionField<Log>
          render={(record) => (
            <CodeSnippet
              language="bash"
              code={`curl -X ${record.method} "https://api.example.com${record.endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"${record.requestBody ? ` \\
  -d '${record.requestBody}'` : ''}`}
            />
          )}
        />
      </div>
    </div>
  </Show>
)
