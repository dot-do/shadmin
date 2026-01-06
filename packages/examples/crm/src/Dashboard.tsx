import { useEffect, useState } from 'react'
import { getMetrics } from './dataProvider'

type Metrics = ReturnType<typeof getMetrics>

// Metric Card component
function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: string
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  )
}

// Pipeline stage component
function PipelineStage({
  stage,
  count,
  color,
  percentage,
}: {
  stage: string
  count: number
  color: string
  percentage: number
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-sm font-medium truncate">{stage}</div>
      <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-8 text-sm text-right">{count}</div>
    </div>
  )
}

// Activity item component
function ActivityItem({
  type,
  subject,
  dueDate,
  priority,
}: {
  type: string
  subject: string
  dueDate: string
  priority: string
}) {
  const typeIcons: Record<string, string> = {
    call: '\uD83D\uDCDE',
    email: '\u2709\uFE0F',
    meeting: '\uD83D\uDCC5',
    task: '\u2705',
    note: '\uD83D\uDCDD',
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-b-0">
      <span className="text-lg">{typeIcons[type] || '\uD83D\uDCCB'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{subject}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[priority]}`}
      >
        {priority}
      </span>
    </div>
  )
}

// Deal item component
function DealItem({
  title,
  company,
  value,
  stage,
}: {
  title: string
  company: string
  value: number
  stage: string
}) {
  const stageColors: Record<string, string> = {
    prospecting: 'bg-gray-100 text-gray-800',
    qualification: 'bg-blue-100 text-blue-800',
    proposal: 'bg-yellow-100 text-yellow-800',
    negotiation: 'bg-purple-100 text-purple-800',
  }

  const stageLabels: Record<string, string> = {
    prospecting: 'Prospecting',
    qualification: 'Qualification',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
  }

  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{company}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
          }).format(value)}
        </p>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stageColors[stage]}`}
        >
          {stageLabels[stage] || stage}
        </span>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    // Simulate async data fetch
    const timer = setTimeout(() => {
      setMetrics(getMetrics())
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalPipelineDeals =
    metrics.dealsByStage.prospecting +
    metrics.dealsByStage.qualification +
    metrics.dealsByStage.proposal +
    metrics.dealsByStage.negotiation

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your CRM dashboard</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          subtitle={`${metrics.activeContacts} active`}
          icon="\uD83D\uDC65"
        />
        <MetricCard
          title="Companies"
          value={metrics.totalCompanies}
          subtitle={`${metrics.activeCompanies} active`}
          icon="\uD83C\uDFE2"
        />
        <MetricCard
          title="Open Deals"
          value={metrics.openDealsCount}
          subtitle={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
          }).format(metrics.openDealsValue)}
          icon="\uD83D\uDCBC"
        />
        <MetricCard
          title="Pending Activities"
          value={metrics.pendingActivities}
          subtitle={`${metrics.highPriorityActivities} high priority`}
          icon="\uD83D\uDCCB"
        />
      </div>

      {/* Won/Lost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-green-50 text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Deals Won</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(metrics.wonDealsValue)}
              </p>
              <p className="text-sm text-green-700 mt-1">{metrics.wonDealsCount} deals closed</p>
            </div>
            <span className="text-5xl">\u2705</span>
          </div>
        </div>
        <div className="rounded-lg border bg-red-50 text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Deals Lost</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{metrics.lostDealsCount}</p>
              <p className="text-sm text-red-700 mt-1">
                Win rate:{' '}
                {metrics.wonDealsCount + metrics.lostDealsCount > 0
                  ? Math.round(
                      (metrics.wonDealsCount / (metrics.wonDealsCount + metrics.lostDealsCount)) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <span className="text-5xl">\u274C</span>
          </div>
        </div>
      </div>

      {/* Pipeline and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stages */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Pipeline Overview</h3>
          <div className="space-y-3">
            <PipelineStage
              stage="Prospecting"
              count={metrics.dealsByStage.prospecting}
              color="bg-gray-500"
              percentage={totalPipelineDeals > 0 ? (metrics.dealsByStage.prospecting / totalPipelineDeals) * 100 : 0}
            />
            <PipelineStage
              stage="Qualification"
              count={metrics.dealsByStage.qualification}
              color="bg-blue-500"
              percentage={totalPipelineDeals > 0 ? (metrics.dealsByStage.qualification / totalPipelineDeals) * 100 : 0}
            />
            <PipelineStage
              stage="Proposal"
              count={metrics.dealsByStage.proposal}
              color="bg-yellow-500"
              percentage={totalPipelineDeals > 0 ? (metrics.dealsByStage.proposal / totalPipelineDeals) * 100 : 0}
            />
            <PipelineStage
              stage="Negotiation"
              count={metrics.dealsByStage.negotiation}
              color="bg-purple-500"
              percentage={totalPipelineDeals > 0 ? (metrics.dealsByStage.negotiation / totalPipelineDeals) * 100 : 0}
            />
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total in Pipeline</span>
              <span className="font-semibold">{totalPipelineDeals} deals</span>
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Open Deals</h3>
          <div className="space-y-1">
            {metrics.recentDeals.map((deal) => (
              <DealItem
                key={deal.id as string}
                title={deal.title}
                company={`Company #${deal.companyId}`}
                value={deal.value}
                stage={deal.stage}
              />
            ))}
          </div>
          {metrics.recentDeals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No open deals</p>
          )}
        </div>

        {/* Upcoming Activities */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Activities</h3>
          <div className="space-y-1">
            {metrics.upcomingActivities.map((activity) => (
              <ActivityItem
                key={activity.id as string}
                type={activity.type}
                subject={activity.subject}
                dueDate={activity.dueDate}
                priority={activity.priority}
              />
            ))}
          </div>
          {metrics.upcomingActivities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No pending activities</p>
          )}
        </div>
      </div>
    </div>
  )
}
