import { List, Datagrid, TextField, DateField, FunctionField } from 'shadmin'
import type { Document } from '../../dataProvider'

/**
 * Document List View
 *
 * Displays shared documents with file type, category, and download options
 */

function FileTypeIcon({ type }: { type: Document['fileType'] }) {
  const icons: Record<Document['fileType'], { icon: JSX.Element; color: string }> = {
    pdf: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-2.5 9.5a1 1 0 011-1h.5v-1h-.5a2 2 0 00-2 2v1a2 2 0 002 2h.5v1h-.5a1 1 0 01-1-1h-1a2 2 0 002 2h.5a2 2 0 002-2v-1a2 2 0 00-2-2h-.5v-1z" />
        </svg>
      ),
      color: 'text-red-500 bg-red-50',
    },
    doc: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v1H8v-1zm0 2h8v1H8v-1zm0 2h5v1H8v-1z" />
        </svg>
      ),
      color: 'text-blue-500 bg-blue-50',
    },
    xls: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm-6 3h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" />
        </svg>
      ),
      color: 'text-green-500 bg-green-50',
    },
    zip: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-2 5h2v2h-2V9zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2z" />
        </svg>
      ),
      color: 'text-amber-500 bg-amber-50',
    },
    img: {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-4 8a2 2 0 110 4 2 2 0 010-4zm6 7H7l2.5-3.5 1.5 2 2.5-3.5 3 5z" />
        </svg>
      ),
      color: 'text-purple-500 bg-purple-50',
    },
  }

  const { icon, color } = icons[type]

  return <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
}

function DocumentTypeBadge({ type }: { type: Document['type'] }) {
  const styles: Record<Document['type'], string> = {
    contract: 'bg-purple-100 text-purple-700',
    invoice: 'bg-green-100 text-green-700',
    report: 'bg-blue-100 text-blue-700',
    deliverable: 'bg-amber-100 text-amber-700',
    other: 'bg-gray-100 text-gray-600',
  }

  const labels: Record<Document['type'], string> = {
    contract: 'Contract',
    invoice: 'Invoice',
    report: 'Report',
    deliverable: 'Deliverable',
    other: 'Other',
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DownloadButton({ url }: { url: string }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        // In a real app, this would trigger a download
        console.log('Download:', url)
      }}
      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
      title="Download"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </button>
  )
}

function UploadButton() {
  return (
    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
      Upload Document
    </button>
  )
}

// Note: DocumentFilters available for future use
// function DocumentFilters() { ... }

export function DocumentList() {
  return (
    <List<Document>
      resource="documents"
      title="Documents"
      sort={{ field: 'uploadedAt', order: 'DESC' }}
      perPage={10}
      actions={<UploadButton />}
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <FunctionField
          source="fileType"
          label=""
          render={(record) => record && <FileTypeIcon type={record.fileType} />}
        />
        <TextField source="name" label="Name" />
        <FunctionField
          source="type"
          label="Type"
          render={(record) => record && <DocumentTypeBadge type={record.type} />}
        />
        <FunctionField
          source="size"
          label="Size"
          render={(record) => (
            <span className="text-sm text-gray-600">{formatFileSize(record?.size ?? 0)}</span>
          )}
        />
        <TextField source="uploadedBy" label="Uploaded By" />
        <DateField source="uploadedAt" label="Date" showTime />
        <FunctionField
          source="url"
          label=""
          render={(record) => record && <DownloadButton url={record.url} />}
        />
      </Datagrid>
    </List>
  )
}
