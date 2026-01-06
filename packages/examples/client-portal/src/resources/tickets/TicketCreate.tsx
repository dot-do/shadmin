import { Create, SimpleForm, TextInput, SelectInput, useCreate, useNotify, useRedirect } from 'shadmin'
import { useState } from 'react'
import type { Ticket } from '../../dataProvider'

/**
 * Ticket Create View
 *
 * Form for creating new support tickets
 */

const priorityChoices = [
  { id: 'low', name: 'Low - General inquiry, no urgency' },
  { id: 'medium', name: 'Medium - Issue affecting work, but has workaround' },
  { id: 'high', name: 'High - Significant impact, needs attention soon' },
  { id: 'urgent', name: 'Urgent - Critical issue, blocking work' },
]

const categoryChoices = [
  { id: 'technical', name: 'Technical Support' },
  { id: 'billing', name: 'Billing Question' },
  { id: 'general', name: 'General Inquiry' },
  { id: 'feature_request', name: 'Feature Request' },
]

function TicketFormContent() {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general',
  })

  const [create, { isPending }] = useCreate()
  const notify = useNotify()
  const redirect = useRedirect()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.subject.trim()) {
      notify('Please enter a subject', { type: 'error' })
      return
    }

    if (!formData.description.trim()) {
      notify('Please enter a description', { type: 'error' })
      return
    }

    try {
      await create('tickets', {
        data: {
          ...formData,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          clientId: 'client-1', // Would come from auth context
          assignedTo: null,
          messages: 1,
        },
      })

      notify('Ticket created successfully', { type: 'success' })
      redirect('/tickets')
    } catch (error) {
      notify('Failed to create ticket', { type: 'error' })
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief summary of your issue"
        />
      </div>

      {/* Category and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categoryChoices.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorityChoices.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Please describe your issue in detail. Include any relevant information such as error messages, steps to reproduce, etc."
        />
        <p className="text-sm text-gray-500 mt-1">
          The more detail you provide, the faster we can help you.
        </p>
      </div>

      {/* File Upload (UI only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <a
          href="/tickets"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  )
}

export function TicketCreate() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Support Ticket</h1>
          <p className="text-gray-600 mt-1">
            Need help? Fill out the form below and our team will get back to you as soon as
            possible.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for faster resolution:</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Provide a clear, descriptive subject line</li>
            <li>Include steps to reproduce the issue if applicable</li>
            <li>Attach screenshots or error messages when possible</li>
            <li>Check our FAQ before submitting - your answer might be there!</li>
          </ul>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <TicketFormContent />
        </div>
      </div>
    </div>
  )
}
