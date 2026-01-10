import { useEffect, useState } from 'react'
import { useDataProvider } from 'shadmin'
import type { ApiKey, Webhook, Log, UsageRecord } from './dataProvider'
import { CodeSnippet } from './components/CodeSnippet'

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

// Stat Card Component
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const StatCard = ({ title, value, subtitle, icon, trend, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </span>
      </div>
      <div>
        <span className="text-3xl font-bold">{value}</span>
        {trend && (
          <span className={`ml-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      {subtitle && (
        <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
      )}
    </div>
  )
}

// Recent Activity Item
interface ActivityItemProps {
  method: string
  endpoint: string
  status: number
  time: string
  responseTime: number
}

const ActivityItem = ({ method, endpoint, status, time, responseTime }: ActivityItemProps) => {
  const methodColors: Record<string, string> = {
    GET: 'text-blue-600 bg-blue-50',
    POST: 'text-green-600 bg-green-50',
    PUT: 'text-yellow-600 bg-yellow-50',
    DELETE: 'text-red-600 bg-red-50',
  }

  const statusColor = status < 400 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 text-xs font-mono font-medium rounded ${methodColors[method] || 'text-gray-600 bg-gray-50'}`}>
          {method}
        </span>
        <span className="font-mono text-sm text-gray-700">{endpoint}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
        <span className="text-sm text-gray-400">{responseTime}ms</span>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    </div>
  )
}

// Mini chart for usage over time
const UsageChart = ({ data }: { data: { date: string; requests: number }[] }) => {
  const maxRequests = Math.max(...data.map(d => d.requests))

  return (
    <div className="flex items-end gap-1 h-24">
      {data.slice(-14).map((day, i) => {
        const height = maxRequests > 0 ? (day.requests / maxRequests) * 100 : 0
        return (
          <div
            key={i}
            className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
            style={{ height: `${height}%` }}
            title={`${day.date}: ${formatNumber(day.requests)} requests`}
          />
        )
      })}
    </div>
  )
}

export function Dashboard() {
  const dataProvider = useDataProvider()
  const [stats, setStats] = useState({
    totalApiKeys: 0,
    activeApiKeys: 0,
    totalWebhooks: 0,
    activeWebhooks: 0,
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    recentLogs: [] as Log[],
    usageData: [] as { date: string; requests: number }[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel
        const [apiKeysRes, webhooksRes, logsRes, usageRes] = await Promise.all([
          dataProvider.getList<ApiKey>('api-keys', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'createdAt', order: 'DESC' },
            filter: {},
          }),
          dataProvider.getList<Webhook>('webhooks', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'createdAt', order: 'DESC' },
            filter: {},
          }),
          dataProvider.getList<Log>('logs', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'timestamp', order: 'DESC' },
            filter: {},
          }),
          dataProvider.getList<UsageRecord>('usage', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'date', order: 'DESC' },
            filter: {},
          }),
        ])

        // Calculate stats
        const activeKeys = apiKeysRes.data.filter(k => k.status === 'active')
        const activeHooks = webhooksRes.data.filter(w => w.status === 'active')

        // Aggregate usage data by date
        const usageByDate = usageRes.data.reduce((acc, record) => {
          if (!acc[record.date]) {
            acc[record.date] = { requests: 0, success: 0, responseTime: 0, count: 0 }
          }
          acc[record.date].requests += record.requestCount
          acc[record.date].success += record.successCount
          acc[record.date].responseTime += record.avgResponseTime
          acc[record.date].count += 1
          return acc
        }, {} as Record<string, { requests: number; success: number; responseTime: number; count: number }>)

        const totalRequests = Object.values(usageByDate).reduce((sum, d) => sum + d.requests, 0)
        const totalSuccess = Object.values(usageByDate).reduce((sum, d) => sum + d.success, 0)
        const avgResponseTime = Object.values(usageByDate).reduce((sum, d) => sum + d.responseTime / d.count, 0) / Object.keys(usageByDate).length

        const usageData = Object.entries(usageByDate)
          .map(([date, data]) => ({ date, requests: data.requests }))
          .sort((a, b) => a.date.localeCompare(b.date))

        setStats({
          totalApiKeys: apiKeysRes.data.length,
          activeApiKeys: activeKeys.length,
          totalWebhooks: webhooksRes.data.length,
          activeWebhooks: activeHooks.length,
          totalRequests,
          successRate: totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 100,
          avgResponseTime: Math.round(avgResponseTime),
          recentLogs: logsRes.data,
          usageData,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [dataProvider])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor your API usage, manage keys, and configure webhooks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="API Keys"
          value={stats.activeApiKeys}
          subtitle={`${stats.totalApiKeys} total, ${stats.activeApiKeys} active`}
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          }
        />
        <StatCard
          title="Webhooks"
          value={stats.activeWebhooks}
          subtitle={`${stats.totalWebhooks} configured`}
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        />
        <StatCard
          title="Total Requests"
          value={formatNumber(stats.totalRequests)}
          subtitle="Last 30 days"
          color="green"
          trend={{ value: 12, isPositive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          }
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate.toFixed(1)}%`}
          subtitle={`${stats.avgResponseTime}ms avg response`}
          color="orange"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <div className="lg:col-span-2 p-6 bg-white border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">API Usage</h3>
              <p className="text-sm text-gray-500">Requests over the last 14 days</p>
            </div>
          </div>
          <UsageChart data={stats.usageData} />
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{stats.usageData[0]?.date || ''}</span>
            <span>{stats.usageData[stats.usageData.length - 1]?.date || ''}</span>
          </div>
        </div>

        {/* Quick Start */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
          <div className="space-y-4">
            <a
              href="#/api-keys/create"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              <div>
                <div className="font-medium text-sm">Create API Key</div>
                <div className="text-xs text-gray-500">Generate a new API key</div>
              </div>
            </a>
            <a
              href="#/webhooks/create"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                </svg>
              </span>
              <div>
                <div className="font-medium text-sm">Add Webhook</div>
                <div className="text-xs text-gray-500">Configure event notifications</div>
              </div>
            </a>
            <a
              href="#/logs"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="p-2 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <div>
                <div className="font-medium text-sm">View Logs</div>
                <div className="text-xs text-gray-500">Monitor API activity</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity and Code Example */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <a href="#/logs" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </a>
          </div>
          <div className="space-y-0">
            {stats.recentLogs.slice(0, 5).map((log) => (
              <ActivityItem
                key={log.id}
                method={log.method}
                endpoint={log.endpoint}
                status={log.statusCode}
                time={new Date(log.timestamp).toLocaleTimeString()}
                responseTime={log.responseTime}
              />
            ))}
          </div>
        </div>

        {/* Code Example */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Integration</h3>
          <CodeSnippet
            language="javascript"
            title="Install & Initialize"
            code={`// Install the SDK
npm install @example/api-sdk

// Initialize the client
import { Client } from '@example/api-sdk';

const client = new Client({
  apiKey: process.env.API_KEY,
  baseUrl: 'https://api.example.com/v1',
});

// Make your first request
const response = await client.getData();
console.log(response);`}
          />
        </div>
      </div>
    </div>
  )
}
