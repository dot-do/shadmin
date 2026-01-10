import { Show, useShowContext, useGetOne } from 'shadmin'
import type { Document, Project } from '../../dataProvider'

/**
 * Document Show View
 *
 * Detailed view of a document with preview and metadata
 */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function FileTypeIcon({ type, large = false }: { type: Document['fileType']; large?: boolean }) {
  const size = large ? 'w-16 h-16' : 'w-8 h-8'

  const colors: Record<Document['fileType'], string> = {
    pdf: 'text-red-500',
    doc: 'text-blue-500',
    xls: 'text-green-500',
    zip: 'text-amber-500',
    img: 'text-purple-500',
  }

  return (
    <svg className={`${size} ${colors[type]}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
    </svg>
  )
}

function DocumentHeader() {
  const { record } = useShowContext<Document>()

  if (!record) return null

  const typeLabels: Record<Document['type'], string> = {
    contract: 'Contract',
    invoice: 'Invoice',
    report: 'Report',
    deliverable: 'Deliverable',
    other: 'Document',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <FileTypeIcon type={record.fileType} large />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{record.name}</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>{typeLabels[record.type]}</span>
            <span>{formatFileSize(record.size)}</span>
            <span>{record.fileType.toUpperCase()}</span>
          </div>
          <div className="mt-4">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentPreview() {
  const { record } = useShowContext<Document>()

  if (!record) return null

  // Different preview based on file type
  if (record.fileType === 'img') {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>Image preview would appear here</p>
          </div>
        </div>
      </div>
    )
  }

  if (record.fileType === 'pdf') {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
            </svg>
            <p>PDF preview would appear here</p>
            <p className="text-sm mt-1">Click download to view the full document</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Preview</h2>
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
        <div className="text-center text-gray-500">
          <FileTypeIcon type={record.fileType} large />
          <p className="mt-4">Preview not available for this file type</p>
          <p className="text-sm mt-1">Download the file to view its contents</p>
        </div>
      </div>
    </div>
  )
}

function DocumentMetadata() {
  const { record } = useShowContext<Document>()
  const { data: project } = useGetOne<Project>(
    'projects',
    { id: record?.projectId || '' },
    { enabled: !!record?.projectId }
  )

  if (!record) return null

  const typeLabels: Record<Document['type'], string> = {
    contract: 'Contract',
    invoice: 'Invoice',
    report: 'Report',
    deliverable: 'Deliverable',
    other: 'Other',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Details</h2>

      <dl className="space-y-4">
        <div>
          <dt className="text-sm text-gray-500">File Type</dt>
          <dd className="mt-1 text-gray-900">{record.fileType.toUpperCase()}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Category</dt>
          <dd className="mt-1 text-gray-900">{typeLabels[record.type]}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Size</dt>
          <dd className="mt-1 text-gray-900">{formatFileSize(record.size)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Uploaded By</dt>
          <dd className="mt-1 text-gray-900">{record.uploadedBy}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Upload Date</dt>
          <dd className="mt-1 text-gray-900">{formatDate(record.uploadedAt)}</dd>
        </div>
        {record.projectId && (
          <div>
            <dt className="text-sm text-gray-500">Related Project</dt>
            <dd className="mt-1">
              <a
                href={`/projects/${record.projectId}/show`}
                className="text-blue-600 hover:text-blue-800"
              >
                {project?.name || 'Loading...'}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {/* Actions */}
      <div className="mt-6 pt-6 border-t space-y-3">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Download
        </button>
        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          Share Link
        </button>
      </div>
    </div>
  )
}

function RelatedDocuments() {
  const { record } = useShowContext<Document>()

  if (!record || !record.projectId) return null

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Related Documents</h2>
      <p className="text-sm text-gray-500">
        Other documents from the same project would appear here.
      </p>
    </div>
  )
}

export function DocumentShow() {
  return (
    <Show<Document> resource="documents">
      <div className="p-6">
        <DocumentHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DocumentPreview />
            <RelatedDocuments />
          </div>
          <div>
            <DocumentMetadata />
          </div>
        </div>
      </div>
    </Show>
  )
}
