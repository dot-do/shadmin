import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  useListContext,
} from 'shadmin'
import type { Project } from '../../dataProvider'

/**
 * Project List View
 *
 * Displays client projects with progress indicators and status badges
 */

function ProgressBar({ value }: { value: number }) {
  const getColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-amber-500'
    return 'bg-gray-400'
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
        <div
          className={`h-2 rounded-full ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 w-10">{value}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const styles = {
    planning: 'bg-gray-100 text-gray-700 border-gray-300',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-300',
    review: 'bg-purple-100 text-purple-700 border-purple-300',
    completed: 'bg-green-100 text-green-700 border-green-300',
  }

  const labels = {
    planning: 'Planning',
    in_progress: 'In Progress',
    review: 'In Review',
    completed: 'Completed',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function BudgetDisplay({ budget, spent }: { budget: number; spent: number }) {
  const percentage = Math.round((spent / budget) * 100)
  const isOverBudget = spent > budget

  return (
    <div className="text-sm">
      <div className={isOverBudget ? 'text-red-600 font-medium' : 'text-gray-900'}>
        ${spent.toLocaleString()} / ${budget.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500">{percentage}% used</div>
    </div>
  )
}

function TaskProgress({ tasks }: { tasks: { total: number; completed: number } }) {
  return (
    <span className="text-sm text-gray-600">
      {tasks.completed}/{tasks.total}
    </span>
  )
}

function ProjectFilters() {
  return (
    <div className="flex gap-4 mb-4">
      <select
        className="px-3 py-2 border rounded-md text-sm"
        defaultValue=""
      >
        <option value="">All Statuses</option>
        <option value="planning">Planning</option>
        <option value="in_progress">In Progress</option>
        <option value="review">In Review</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  )
}

export function ProjectList() {
  return (
    <List<Project>
      resource="projects"
      title="My Projects"
      sort={{ field: 'dueDate', order: 'ASC' }}
      perPage={10}
    >
      <Datagrid
        rowClick="show"
        bulkActionButtons={false}
      >
        <TextField source="name" label="Project Name" />
        <FunctionField<Project>
          source="status"
          label="Status"
          render={(record) => record && <StatusBadge status={record.status} />}
        />
        <FunctionField<Project>
          source="progress"
          label="Progress"
          render={(record) => record && <ProgressBar value={record.progress} />}
        />
        <FunctionField<Project>
          source="tasks"
          label="Tasks"
          render={(record) => record && <TaskProgress tasks={record.tasks} />}
        />
        <TextField source="manager" label="Manager" />
        <DateField source="dueDate" label="Due Date" />
        <FunctionField<Project>
          source="budget"
          label="Budget"
          render={(record) =>
            record && <BudgetDisplay budget={record.budget} spent={record.spent} />
          }
        />
      </Datagrid>
    </List>
  )
}
