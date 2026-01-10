import {
  List,
  Datagrid,
  TextField,
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

// Render helpers that work with FunctionField's render prop
const renderSuccessRate = (success: number, total: number) => {
  const rate = total > 0 ? (success / total) * 100 : 0
  const colorClass = rate < 95 ? 'text-red-600' : rate < 99 ? 'text-yellow-600' : 'text-green-600'
  return <span className={`font-medium ${colorClass}`}>{rate.toFixed(1)}%</span>
}

const renderErrorCount = (count: number) => {
  const colorClass = count === 0 ? 'text-gray-400' : count < 10 ? 'text-yellow-600' : 'text-red-600'
  return <span className={`font-medium ${colorClass}`}>{count}</span>
}

const renderResponseTime = (ms: number) => {
  const colorClass = ms > 300 ? 'text-red-600' : ms > 150 ? 'text-yellow-600' : 'text-green-600'
  const indicator = ms > 300 ? 'Slow' : ms > 150 ? 'Moderate' : 'Fast'
  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono text-sm ${colorClass}`}>{ms}ms</span>
      <span className={`text-xs ${colorClass}`}>({indicator})</span>
    </div>
  )
}

const renderUsageBar = (value: number, max: number) => {
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
  <List sort={{ field: 'date', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="date" />
      <TextField source="apiKeyName" />
      <FunctionField
        label="Requests"
        render={(record) => {
          const r = record as UsageRecord | undefined
          return r ? renderUsageBar(r.requestCount, 15000) : null
        }}
      />
      <FunctionField
        label="Success Rate"
        render={(record) => {
          const r = record as UsageRecord | undefined
          return r ? renderSuccessRate(r.successCount, r.requestCount) : null
        }}
      />
      <FunctionField
        label="Errors"
        render={(record) => {
          const r = record as UsageRecord | undefined
          return r ? renderErrorCount(r.errorCount) : null
        }}
      />
      <FunctionField
        label="Avg Response"
        render={(record) => {
          const r = record as UsageRecord | undefined
          return r ? renderResponseTime(r.avgResponseTime) : null
        }}
      />
      <FunctionField
        label="Bandwidth"
        render={(record) => {
          const r = record as UsageRecord | undefined
          return r ? <span className="font-mono text-sm">{r.bandwidthMB} MB</span> : null
        }}
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
          <FunctionField
            render={(record) => {
              const r = record as UsageRecord | undefined
              return r ? <span className="font-mono text-sm">{r.endpoint}</span> : null
            }}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-500 block mb-1">Bandwidth</label>
          <FunctionField
            render={(record) => {
              const r = record as UsageRecord | undefined
              return r ? <span className="font-mono">{r.bandwidthMB} MB</span> : null
            }}
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
          <FunctionField
            render={(record) => {
              const r = record as UsageRecord | undefined
              if (!r) return null
              return (
                <div>
                  <span className="text-3xl font-bold">{formatNumber(r.requestCount)}</span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {r.successCount.toLocaleString()} successful
                    </span>
                  </div>
                </div>
              )
            }}
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
          <FunctionField
            render={(record) => {
              const r = record as UsageRecord | undefined
              if (!r) return null
              const rate = r.requestCount > 0 ? (r.successCount / r.requestCount) * 100 : 0
              const colorClass = rate >= 99 ? 'text-green-600' : rate >= 95 ? 'text-yellow-600' : 'text-red-600'
              return (
                <div>
                  <span className={`text-3xl font-bold ${colorClass}`}>{rate.toFixed(2)}%</span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">{r.errorCount} errors</span>
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
          <FunctionField
            render={(record) => {
              const r = record as UsageRecord | undefined
              if (!r) return null
              const ms = r.avgResponseTime
              const colorClass = ms <= 100 ? 'text-green-600' : ms <= 200 ? 'text-yellow-600' : 'text-red-600'
              return (
                <div>
                  <span className={`text-3xl font-bold ${colorClass}`}>{ms}ms</span>
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
        <FunctionField
          render={(record) => {
            const r = record as UsageRecord | undefined
            if (!r) return null
            return (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Successful Requests</span>
                    <span className="text-sm text-gray-500">{r.successCount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(r.successCount / r.requestCount) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Failed Requests</span>
                    <span className="text-sm text-gray-500">{r.errorCount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(r.errorCount / r.requestCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  </Show>
)
