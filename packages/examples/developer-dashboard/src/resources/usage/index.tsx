import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  Show,
} from 'shadmin'
import type { UsageRecord } from '../../dataProvider'

// Format number with K/M suffix
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Success rate indicator
const SuccessRate = ({ success, total }: { success: number; total: number }) => {
  const rate = total > 0 ? (success / total) * 100 : 0
  let colorClass = 'text-green-600'

  if (rate < 95) {
    colorClass = 'text-red-600'
  } else if (rate < 99) {
    colorClass = 'text-yellow-600'
  }

  return (
    <span className={`font-medium ${colorClass}`}>
      {rate.toFixed(1)}%
    </span>
  )
}

// Error count indicator
const ErrorCount = ({ count }: { count: number }) => {
  const colorClass = count === 0 ? 'text-gray-400' : count < 10 ? 'text-yellow-600' : 'text-red-600'

  return (
    <span className={`font-medium ${colorClass}`}>
      {count}
    </span>
  )
}

// Response time indicator
const AvgResponseTime = ({ ms }: { ms: number }) => {
  let colorClass = 'text-green-600'
  let indicator = 'Fast'

  if (ms > 300) {
    colorClass = 'text-red-600'
    indicator = 'Slow'
  } else if (ms > 150) {
    colorClass = 'text-yellow-600'
    indicator = 'Moderate'
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono text-sm ${colorClass}`}>{ms}ms</span>
      <span className={`text-xs ${colorClass}`}>({indicator})</span>
    </div>
  )
}

// Mini bar chart for visual comparison
const UsageBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className="text-sm font-mono">{formatNumber(value)}</span>
    </div>
  )
}

export const UsageList = () => (
  <List
    sort={{ field: 'date', order: 'DESC' }}
    filters={[
      { source: 'date', alwaysOn: true },
      { source: 'apiKeyName', alwaysOn: true },
    ]}
  >
    <Datagrid rowClick="show">
      <TextField source="date" />
      <TextField source="apiKeyName" />
      <FunctionField<UsageRecord>
        source="requestCount"
        label="Requests"
        render={(record) => (
          <UsageBar value={record.requestCount} max={15000} />
        )}
      />
      <FunctionField<UsageRecord>
        source="successCount"
        label="Success Rate"
        render={(record) => (
          <SuccessRate success={record.successCount} total={record.requestCount} />
        )}
      />
      <FunctionField<UsageRecord>
        source="errorCount"
        label="Errors"
        render={(record) => <ErrorCount count={record.errorCount} />}
      />
      <FunctionField<UsageRecord>
        source="avgResponseTime"
        label="Avg Response"
        render={(record) => <AvgResponseTime ms={record.avgResponseTime} />}
      />
      <FunctionField<UsageRecord>
        source="bandwidthMB"
        label="Bandwidth"
        render={(record) => (
          <span className="font-mono text-sm">{record.bandwidthMB} MB</span>
        )}
      />
    </Datagrid>
  </List>
)

export const UsageShow = () => (
  <Show>
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Date</label>
          <TextField source="date" />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">API Key</label>
          <TextField source="apiKeyName" />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Endpoint</label>
          <FunctionField<UsageRecord>
            source="endpoint"
            render={(record) => (
              <span className="font-mono text-sm">{record.endpoint}</span>
            )}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Bandwidth</label>
          <FunctionField<UsageRecord>
            source="bandwidthMB"
            render={(record) => (
              <span className="font-mono">{record.bandwidthMB} MB</span>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Total Requests</span>
            <span className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </span>
          </div>
          <FunctionField<UsageRecord>
            render={(record) => (
              <div>
                <span className="text-3xl font-bold">{formatNumber(record.requestCount)}</span>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {record.successCount.toLocaleString()} successful
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Success Rate</span>
            <span className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <FunctionField<UsageRecord>
            render={(record) => {
              const rate = record.requestCount > 0
                ? (record.successCount / record.requestCount) * 100
                : 0
              const colorClass = rate >= 99 ? 'text-green-600' : rate >= 95 ? 'text-yellow-600' : 'text-red-600'

              return (
                <div>
                  <span className={`text-3xl font-bold ${colorClass}`}>
                    {rate.toFixed(2)}%
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {record.errorCount} errors
                    </span>
                  </div>
                </div>
              )
            }}
          />
        </div>

        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Avg Response Time</span>
            <span className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <FunctionField<UsageRecord>
            render={(record) => {
              const ms = record.avgResponseTime
              const colorClass = ms <= 100 ? 'text-green-600' : ms <= 200 ? 'text-yellow-600' : 'text-red-600'

              return (
                <div>
                  <span className={`text-3xl font-bold ${colorClass}`}>
                    {ms}ms
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {ms <= 100 ? 'Excellent' : ms <= 200 ? 'Good' : 'Needs improvement'}
                    </span>
                  </div>
                </div>
              )
            }}
          />
        </div>
      </div>

      <div className="p-6 bg-white border rounded-xl shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Request Distribution</h4>
        <FunctionField<UsageRecord>
          render={(record) => (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Successful Requests</span>
                  <span className="text-sm text-gray-500">{record.successCount.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(record.successCount / record.requestCount) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Failed Requests</span>
                  <span className="text-sm text-gray-500">{record.errorCount.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(record.errorCount / record.requestCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  </Show>
)
