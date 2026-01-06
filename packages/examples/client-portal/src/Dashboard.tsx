import { useGetList, useGetIdentity } from 'shadmin'
import type { Project, Ticket, Document } from './dataProvider'

/**
 * Client Portal Dashboard
 *
 * Displays an overview of:
 * - Active projects with progress
 * - Recent/open support tickets
 * - Latest documents
 * - Quick stats and actions
 */

export function Dashboard() {
  const { data: identity } = useGetIdentity()
  const { data: projects, isLoading: projectsLoading } = useGetList<Project>('projects', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'progress', order: 'DESC' },
    filter: { status: ['planning', 'in_progress', 'review'] },
  })

  const { data: tickets, isLoading: ticketsLoading } = useGetList<Ticket>('tickets', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'createdAt', order: 'DESC' },
    filter: { status: ['open', 'in_progress', 'waiting_client'] },
  })

  const { data: documents, isLoading: documentsLoading } = useGetList<Document>('documents', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'uploadedAt', order: 'DESC' },
  })

  const greeting = getGreeting()

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          {greeting}, {identity?.fullName || 'Guest'}!
        </h1>
        <p className="text-blue-100 mt-1">
          Welcome to your client portal. Here's an overview of your projects and activity.
        </p>
        {identity?.company && (
          <p className="text-blue-200 text-sm mt-2">{identity.company as string}</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={projects?.filter((p) => p.status !== 'completed').length ?? 0}
          icon="folder"
          color="blue"
        />
        <StatCard
          title="Open Tickets"
          value={tickets?.filter((t) => t.status === 'open').length ?? 0}
          icon="ticket"
          color="amber"
        />
        <StatCard
          title="Awaiting Response"
          value={tickets?.filter((t) => t.status === 'waiting_client').length ?? 0}
          icon="clock"
          color="red"
        />
        <StatCard
          title="Documents"
          value={documents?.length ?? 0}
          icon="document"
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
            <a href="/projects" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </a>
          </div>

          {projectsLoading ? (
            <LoadingState />
          ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState message="No active projects" />
          )}
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
            <a href="/tickets" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </a>
          </div>

          {ticketsLoading ? (
            <LoadingState />
          ) : tickets && tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <EmptyState message="No open tickets" />
          )}

          <div className="mt-4 pt-4 border-t">
            <a
              href="/tickets/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <PlusIcon />
              New Ticket
            </a>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
          <a href="/documents" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </a>
        </div>

        {documentsLoading ? (
          <LoadingState />
        ) : documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <EmptyState message="No documents yet" />
        )}
      </div>
    </div>
  )
}

// Helper Components

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: string
  color: 'blue' | 'amber' | 'red' | 'green'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <IconComponent name={icon} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const statusColors = {
    planning: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    review: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
  }

  return (
    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{project.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[project.status]}`}>
          {formatStatus(project.status)}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Due: {formatDate(project.dueDate)}</span>
        <span>
          Tasks: {project.tasks.completed}/{project.tasks.total}
        </span>
      </div>
    </div>
  )
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700',
  }

  const statusIcons: Record<string, string> = {
    open: 'circle-dot',
    in_progress: 'loader',
    waiting_client: 'alert-circle',
    resolved: 'check-circle',
    closed: 'x-circle',
  }

  return (
    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-blue-300 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        <StatusIcon status={ticket.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</h4>
          <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatStatus(ticket.status)} - {formatRelativeTime(ticket.updatedAt)}
        </p>
      </div>
      <div className="flex-shrink-0 text-gray-400">
        <span className="text-xs">{ticket.messages} msgs</span>
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: Document }) {
  const typeColors = {
    contract: 'bg-purple-100 text-purple-700',
    invoice: 'bg-green-100 text-green-700',
    report: 'bg-blue-100 text-blue-700',
    deliverable: 'bg-amber-100 text-amber-700',
    other: 'bg-gray-100 text-gray-700',
  }

  const fileIcons: Record<string, string> = {
    pdf: 'file-text',
    doc: 'file-text',
    xls: 'table',
    zip: 'archive',
    img: 'image',
  }

  return (
    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
      <div className="flex-shrink-0 p-2 bg-gray-100 rounded">
        <FileIcon type={document.fileType} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{document.name}</h4>
        <div className="flex items-center space-x-2 mt-1">
          <span className={`px-2 py-0.5 rounded text-xs ${typeColors[document.type]}`}>
            {document.type}
          </span>
          <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>{message}</p>
    </div>
  )
}

// Icons
function IconComponent({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    folder: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    ticket: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    clock: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    document: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  }
  return icons[name] || null
}

function StatusIcon({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    open: 'text-blue-500',
    in_progress: 'text-amber-500',
    waiting_client: 'text-red-500',
    resolved: 'text-green-500',
    closed: 'text-gray-400',
  }

  return (
    <svg className={`w-5 h-5 ${statusStyles[status] || 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="6" />
    </svg>
  )
}

function FileIcon({ type }: { type: string }) {
  return (
    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

// Utility functions
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
