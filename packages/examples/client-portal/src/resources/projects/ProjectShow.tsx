import { Show, useShowContext } from 'shadmin'
import type { Project } from '../../dataProvider'

/**
 * Project Show View
 *
 * Detailed view of a single project with timeline, tasks, and budget breakdown
 */

function ProjectHeader() {
  const { record } = useShowContext<Project>()

  if (!record) return null

  const statusColors = {
    planning: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    review: 'bg-purple-500',
    completed: 'bg-green-500',
  }

  const statusLabels = {
    planning: 'Planning',
    in_progress: 'In Progress',
    review: 'In Review',
    completed: 'Completed',
  }

  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{record.name}</h1>
          <p className="text-slate-300 mt-1">{record.description}</p>
          <p className="text-slate-400 text-sm mt-2">Managed by {record.manager}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[record.status]} text-white`}
        >
          {statusLabels[record.status]}
        </span>
      </div>
    </div>
  )
}

function ProgressSection() {
  const { record } = useShowContext<Project>()

  if (!record) return null

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-amber-500'
    return 'bg-gray-400'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>

      <div className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{record.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${getProgressColor(record.progress)}`}
              style={{ width: `${record.progress}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{record.tasks.total}</div>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{record.tasks.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {record.tasks.total - record.tasks.completed}
            </div>
            <div className="text-sm text-gray-500">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BudgetSection() {
  const { record } = useShowContext<Project>()

  if (!record) return null

  const budgetUsed = (record.spent / record.budget) * 100
  const remaining = record.budget - record.spent
  const isOverBudget = record.spent > record.budget

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Budget</h2>

      <div className="space-y-4">
        {/* Budget Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Budget Usage</span>
            <span className={isOverBudget ? 'text-red-600 font-medium' : 'font-medium'}>
              {budgetUsed.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Budget Details */}
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
          <div>
            <div className="text-xl font-bold text-gray-900">
              ${record.budget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Budget</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">
              ${record.spent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Spent</div>
          </div>
          <div>
            <div
              className={`text-xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}
            >
              ${Math.abs(remaining).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineSection() {
  const { record } = useShowContext<Project>()

  if (!record) return null

  const startDate = new Date(record.startDate)
  const dueDate = new Date(record.dueDate)
  const today = new Date()

  const totalDays = Math.ceil((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const isOverdue = today > dueDate && record.status !== 'completed'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Timeline</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Start Date</div>
            <div className="font-medium">
              {startDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Due Date</div>
            <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
              {dueDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="relative pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min((daysElapsed / totalDays) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{daysElapsed} days elapsed</span>
            <span>
              {isOverdue
                ? `${Math.abs(daysRemaining)} days overdue`
                : `${daysRemaining} days remaining`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectShow() {
  return (
    <Show<Project> resource="projects">
      <div className="p-6">
        <ProjectHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressSection />
          <BudgetSection />
        </div>

        <div className="mt-6">
          <TimelineSection />
        </div>
      </div>
    </Show>
  )
}
