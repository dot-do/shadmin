import { Show, useShowContext } from 'shadmin'
import type { Ticket } from '../../dataProvider'

/**
 * Ticket Show View
 *
 * Detailed view of a support ticket with conversation thread
 */

function TicketHeader() {
  const { record } = useShowContext<Ticket>()

  if (!record) return null

  const statusStyles: Record<Ticket['status'], { bg: string; text: string; label: string }> = {
    open: { bg: 'bg-blue-500', text: 'text-white', label: 'Open' },
    in_progress: { bg: 'bg-amber-500', text: 'text-white', label: 'In Progress' },
    waiting_client: { bg: 'bg-red-500', text: 'text-white', label: 'Awaiting Your Response' },
    resolved: { bg: 'bg-green-500', text: 'text-white', label: 'Resolved' },
    closed: { bg: 'bg-gray-500', text: 'text-white', label: 'Closed' },
  }

  const priorityStyles: Record<Ticket['priority'], string> = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-amber-600',
    urgent: 'text-red-600 font-bold',
  }

  const status = statusStyles[record.status]

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
            <span className={`text-sm font-medium ${priorityStyles[record.priority]}`}>
              {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)} Priority
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">{record.subject}</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>Ticket #{record.id}</span>
            <span>Category: {formatCategory(record.category)}</span>
            <span>Created: {formatDateTime(record.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketDescription() {
  const { record } = useShowContext<Ticket>()

  if (!record) return null

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Description</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{record.description}</p>
    </div>
  )
}

function ConversationThread() {
  const { record } = useShowContext<Ticket>()

  if (!record) return null

  // Mock conversation messages
  const messages = [
    {
      id: 1,
      author: 'You',
      isClient: true,
      content: record.description,
      timestamp: record.createdAt,
    },
    {
      id: 2,
      author: 'Support Team',
      isClient: false,
      content:
        'Thank you for reaching out. We have received your ticket and our team is reviewing it. We will get back to you as soon as possible.',
      timestamp: new Date(new Date(record.createdAt).getTime() + 3600000).toISOString(),
    },
    ...(record.status !== 'open'
      ? [
          {
            id: 3,
            author: 'Support Team',
            isClient: false,
            content:
              'We are currently working on this issue. We may need additional information from you to proceed.',
            timestamp: new Date(new Date(record.createdAt).getTime() + 7200000).toISOString(),
          },
        ]
      : []),
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Conversation</h2>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.isClient ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-900">{message.author}</span>
              <span className="text-xs text-gray-500">{formatDateTime(message.timestamp)}</span>
            </div>
            <p className="text-gray-700">{message.content}</p>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {record.status !== 'closed' && record.status !== 'resolved' && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-medium mb-3">Add Reply</h3>
          <textarea
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Type your message..."
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <span className="text-sm text-gray-500">Attach files</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TicketActions() {
  const { record } = useShowContext<Ticket>()

  if (!record) return null

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Actions</h2>

      <div className="space-y-3">
        {record.status === 'resolved' && (
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Confirm Resolution
          </button>
        )}
        {record.status === 'resolved' && (
          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Reopen Ticket
          </button>
        )}
        {record.status !== 'closed' && record.status !== 'resolved' && (
          <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors">
            Cancel Ticket
          </button>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="font-medium mb-3 text-sm text-gray-500">Ticket Details</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Assigned To</dt>
            <dd className="text-gray-900">{record.assignedTo || 'Unassigned'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Last Updated</dt>
            <dd className="text-gray-900">{formatDateTime(record.updatedAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Messages</dt>
            <dd className="text-gray-900">{record.messages}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

// Utility functions
function formatCategory(category: Ticket['category']): string {
  const labels: Record<Ticket['category'], string> = {
    technical: 'Technical Support',
    billing: 'Billing',
    general: 'General Inquiry',
    feature_request: 'Feature Request',
  }
  return labels[category]
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function TicketShow() {
  return (
    <Show<Ticket> resource="tickets">
      <div className="p-6">
        <TicketHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConversationThread />
          </div>
          <div>
            <TicketActions />
          </div>
        </div>
      </div>
    </Show>
  )
}
