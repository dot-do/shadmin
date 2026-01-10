import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
} from 'shadmin'
import type { Ticket } from '../../dataProvider'

/**
 * Ticket List View
 *
 * Displays support tickets with status, priority, and category badges
 */

function StatusBadge({ status }: { status: Ticket['status'] }) {
  const styles: Record<Ticket['status'], string> = {
    open: 'bg-blue-100 text-blue-700 border-blue-300',
    in_progress: 'bg-amber-100 text-amber-700 border-amber-300',
    waiting_client: 'bg-red-100 text-red-700 border-red-300',
    resolved: 'bg-green-100 text-green-700 border-green-300',
    closed: 'bg-gray-100 text-gray-600 border-gray-300',
  }

  const labels: Record<Ticket['status'], string> = {
    open: 'Open',
    in_progress: 'In Progress',
    waiting_client: 'Awaiting Response',
    resolved: 'Resolved',
    closed: 'Closed',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: Ticket['priority'] }) {
  const styles: Record<Ticket['priority'], string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700',
  }

  const icons: Record<Ticket['priority'], string> = {
    low: '',
    medium: '',
    high: '!',
    urgent: '!!',
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[priority]}`}>
      {icons[priority]} {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

function CategoryBadge({ category }: { category: Ticket['category'] }) {
  const styles: Record<Ticket['category'], string> = {
    technical: 'bg-purple-100 text-purple-700',
    billing: 'bg-green-100 text-green-700',
    general: 'bg-gray-100 text-gray-600',
    feature_request: 'bg-blue-100 text-blue-700',
  }

  const labels: Record<Ticket['category'], string> = {
    technical: 'Technical',
    billing: 'Billing',
    general: 'General',
    feature_request: 'Feature Request',
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[category]}`}>
      {labels[category]}
    </span>
  )
}

function CreateTicketButton() {
  return (
    <a
      href="/tickets/create"
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      New Ticket
    </a>
  )
}

export function TicketList() {
  return (
    <List<Ticket>
      resource="tickets"
      title="Support Tickets"
      sort={{ field: 'createdAt', order: 'DESC' }}
      perPage={10}
      actions={<CreateTicketButton />}
    >
      <Datagrid
        rowClick="show"
        bulkActionButtons={false}
      >
        <TextField source="subject" label="Subject" />
        <FunctionField
          source="status"
          label="Status"
          render={(record) => record && <StatusBadge status={record.status} />}
        />
        <FunctionField
          source="priority"
          label="Priority"
          render={(record) => record && <PriorityBadge priority={record.priority} />}
        />
        <FunctionField
          source="category"
          label="Category"
          render={(record) => record && <CategoryBadge category={record.category} />}
        />
        <FunctionField
          source="messages"
          label="Messages"
          render={(record) => (
            <span className="text-sm text-gray-600">{record?.messages ?? 0}</span>
          )}
        />
        <DateField source="createdAt" label="Created" showTime />
        <DateField source="updatedAt" label="Updated" showTime />
      </Datagrid>
    </List>
  )
}
