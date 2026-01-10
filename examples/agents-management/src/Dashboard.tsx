/**
 * Dashboard - Main dashboard for AI Agents Management
 */

import { useGetList } from 'shadmin'
import type { Agent, Conversation, Tool, Prompt } from './dataProvider'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  color?: string
}

function StatCard({ title, value, subtitle, color = 'bg-card' }: StatCardProps) {
  return (
    <div className={`p-6 rounded-lg border ${color}`}>
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      {subtitle && (
        <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
      )}
    </div>
  )
}

interface RecentActivityItemProps {
  title: string
  description: string
  time: string
  type: 'agent' | 'conversation' | 'tool' | 'prompt'
}

function RecentActivityItem({ title, description, time, type }: RecentActivityItemProps) {
  const typeColors: Record<string, string> = {
    agent: 'bg-green-100 text-green-800',
    conversation: 'bg-blue-100 text-blue-800',
    tool: 'bg-purple-100 text-purple-800',
    prompt: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[type]}`}
      >
        {type}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{title}</div>
        <div className="text-sm text-muted-foreground truncate">{description}</div>
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">{time}</div>
    </div>
  )
}

export function Dashboard() {
  // Fetch summary data
  const { data: agents = [], total: totalAgents = 0 } = useGetList<Agent>('agents', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'updatedAt', order: 'DESC' },
    filter: {},
  })

  const { data: conversations = [], total: totalConversations = 0 } = useGetList<Conversation>('conversations', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'lastMessageAt', order: 'DESC' },
    filter: {},
  })

  const { data: tools = [], total: totalTools = 0 } = useGetList<Tool>('tools', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'usageCount', order: 'DESC' },
    filter: {},
  })

  const { total: totalPrompts = 0 } = useGetList<Prompt>('prompts', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'usageCount', order: 'DESC' },
    filter: {},
  })

  // Calculate statistics
  const activeAgents = agents.filter((a) => a.status === 'active').length
  const activeConversations = conversations.filter((c) => c.status === 'active').length
  const enabledTools = tools.filter((t) => t.enabled).length
  const totalTokensUsed = agents.reduce((sum, a) => sum + a.totalTokensUsed, 0)
  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0)

  // Format recent activity
  const recentActivity: RecentActivityItemProps[] = [
    ...conversations.slice(0, 3).map((c) => ({
      title: c.title,
      description: `${c.messageCount} messages - ${c.status}`,
      time: new Date(c.lastMessageAt).toLocaleTimeString(),
      type: 'conversation' as const,
    })),
    ...agents.slice(0, 2).map((a) => ({
      title: a.name,
      description: `${a.conversationCount} conversations - ${a.status}`,
      time: new Date(a.updatedAt).toLocaleTimeString(),
      type: 'agent' as const,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Agents Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your AI agents, conversations, tools, and prompts
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Agents"
          value={totalAgents}
          subtitle={`${activeAgents} active`}
        />
        <StatCard
          title="Conversations"
          value={totalConversations}
          subtitle={`${activeConversations} active`}
        />
        <StatCard
          title="Tools"
          value={totalTools}
          subtitle={`${enabledTools} enabled`}
        />
        <StatCard
          title="Prompts"
          value={totalPrompts}
          subtitle="templates available"
        />
      </div>

      {/* Token Usage and Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Tokens Used"
          value={`${(totalTokensUsed / 1000000).toFixed(2)}M`}
          subtitle="across all agents"
          color="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
        />
        <StatCard
          title="Total Messages"
          value={totalMessages.toLocaleString()}
          subtitle="across all conversations"
          color="bg-gradient-to-br from-green-50 to-teal-50 border-green-200"
        />
      </div>

      {/* Agent Performance and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
          <div className="space-y-4">
            {agents.slice(0, 5).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      agent.status === 'active'
                        ? 'bg-green-500'
                        : agent.status === 'inactive'
                        ? 'bg-gray-400'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <span className="font-medium">{agent.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {agent.conversationCount.toLocaleString()} conversations
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <RecentActivityItem key={index} {...activity} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Tools */}
      <div className="p-6 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Most Used Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.slice(0, 6).map((tool) => (
            <div
              key={tool.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div>
                <div className="font-mono text-sm">{tool.name}</div>
                <div className="text-xs text-muted-foreground">{tool.type}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{tool.usageCount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">calls</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
