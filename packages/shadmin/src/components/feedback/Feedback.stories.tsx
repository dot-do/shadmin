import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { Loading } from './Loading'
import { Error as ErrorComponent } from './Error'
import { Empty } from './Empty'
import { Confirm } from './Confirm'
import { NotificationToast, NotificationContainer } from './Notification'
import { Button } from '../Button'

// =============================================================================
// Loading Component Stories
// =============================================================================

const loadingMeta: Meta<typeof Loading> = {
  title: 'Components/Feedback/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable loading spinner with different sizes and optional text. Use for indicating loading states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Size of the spinner',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    text: {
      control: 'text',
      description: 'Optional text to display below the spinner',
    },
    fullscreen: {
      control: 'boolean',
      description: 'Display as fullscreen overlay',
    },
  },
}

export default loadingMeta

type LoadingStory = StoryObj<typeof Loading>

/**
 * Default loading spinner
 */
export const LoadingDefault: LoadingStory = {
  args: {},
}

/**
 * Small loading spinner
 */
export const LoadingSmall: LoadingStory = {
  args: {
    size: 'sm',
  },
}

/**
 * Large loading spinner
 */
export const LoadingLarge: LoadingStory = {
  args: {
    size: 'lg',
  },
}

/**
 * Extra large loading spinner
 */
export const LoadingExtraLarge: LoadingStory = {
  args: {
    size: 'xl',
  },
}

/**
 * Loading spinner with text
 */
export const LoadingWithText: LoadingStory = {
  args: {
    text: 'Loading data...',
  },
}

/**
 * Large spinner with custom text
 */
export const LoadingLargeWithText: LoadingStory = {
  args: {
    size: 'lg',
    text: 'Please wait while we fetch your data',
  },
}

/**
 * All loading sizes displayed together
 */
export const LoadingAllSizes: LoadingStory = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <Loading size="sm" />
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading size="default" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading size="lg" />
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading size="xl" />
        <span className="text-xs text-muted-foreground">Extra Large</span>
      </div>
    </div>
  ),
}

/**
 * Custom color loading spinner
 */
export const LoadingCustomColor: LoadingStory = {
  args: {
    color: '#8b5cf6',
    size: 'lg',
    text: 'Processing...',
  },
}

/**
 * Fullscreen loading overlay (click to see)
 */
export const LoadingFullscreen: LoadingStory = {
  render: () => {
    const [show, setShow] = useState(false)

    return (
      <>
        <Button onClick={() => setShow(true)}>Show Fullscreen Loading</Button>
        {show && (
          <div onClick={() => setShow(false)} className="cursor-pointer">
            <Loading fullscreen size="xl" text="Loading application..." />
          </div>
        )}
      </>
    )
  },
}

// =============================================================================
// Error Component Stories
// =============================================================================

/**
 * Basic error display
 */
export const ErrorBasic: StoryObj<typeof ErrorComponent> = {
  render: () => (
    <ErrorComponent error="Something went wrong. Please try again later." />
  ),
  name: 'Error - Basic',
}

/**
 * Error with retry button
 */
export const ErrorWithRetry: StoryObj<typeof ErrorComponent> = {
  render: () => (
    <ErrorComponent
      error="Failed to load data from server"
      onRetry={fn()}
    />
  ),
  name: 'Error - With Retry',
}

/**
 * Error from Error object
 */
export const ErrorFromObject: StoryObj<typeof ErrorComponent> = {
  render: () => (
    <ErrorComponent
      error={new Error('Network request failed: Connection timeout')}
      onRetry={fn()}
    />
  ),
  name: 'Error - From Error Object',
}

/**
 * Error with custom title
 */
export const ErrorCustomTitle: StoryObj<typeof ErrorComponent> = {
  render: () => (
    <ErrorComponent
      title="Unable to save changes"
      error="The server returned an unexpected response. Your changes were not saved."
      onRetry={fn()}
      retryLabel="Save again"
    />
  ),
  name: 'Error - Custom Title',
}

/**
 * Error without icon
 */
export const ErrorNoIcon: StoryObj<typeof ErrorComponent> = {
  render: () => (
    <ErrorComponent
      error="A minor error occurred"
      hideIcon
    />
  ),
  name: 'Error - Without Icon',
}

/**
 * Error with custom content
 */
export const ErrorCustomContent: StoryObj<typeof ErrorComponent> = {
  render: () => (
    <ErrorComponent title="Validation Failed">
      <ul className="text-sm text-muted-foreground list-disc list-inside">
        <li>Email is required</li>
        <li>Password must be at least 8 characters</li>
        <li>Terms must be accepted</li>
      </ul>
    </ErrorComponent>
  ),
  name: 'Error - Custom Content',
}

// =============================================================================
// Empty Component Stories
// =============================================================================

/**
 * Basic empty state
 */
export const EmptyBasic: StoryObj<typeof Empty> = {
  render: () => <Empty message="No items found" />,
  name: 'Empty - Basic',
}

/**
 * Empty with description
 */
export const EmptyWithDescription: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      message="No messages"
      description="You don't have any messages in your inbox yet. New messages will appear here."
    />
  ),
  name: 'Empty - With Description',
}

/**
 * Empty with action button
 */
export const EmptyWithAction: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      icon="inbox"
      message="No orders yet"
      description="When you receive new orders, they will appear here."
      actionLabel="Create Order"
      onAction={fn()}
    />
  ),
  name: 'Empty - With Action',
}

/**
 * Empty state for search results
 */
export const EmptySearchResults: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      icon="search"
      message="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
      actionLabel="Clear filters"
      onAction={fn()}
      actionVariant="outline"
    />
  ),
  name: 'Empty - Search Results',
}

/**
 * Empty state for files
 */
export const EmptyFiles: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      icon="file"
      message="No documents"
      description="Upload your first document to get started."
      actionLabel="Upload Document"
      onAction={fn()}
    />
  ),
  name: 'Empty - Files',
}

/**
 * Empty state for folders
 */
export const EmptyFolders: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      icon="folder"
      message="Empty folder"
      description="This folder doesn't contain any files yet."
      actionLabel="Add Files"
      onAction={fn()}
      actionVariant="secondary"
    />
  ),
  name: 'Empty - Folders',
}

/**
 * Empty state for users
 */
export const EmptyUsers: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      icon="users"
      message="No team members"
      description="Invite people to collaborate with you."
      actionLabel="Invite Members"
      onAction={fn()}
    />
  ),
  name: 'Empty - Users',
}

/**
 * Empty with resource name (auto-generates message)
 */
export const EmptyWithResource: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      resource="products"
      description="Create your first product to start selling."
      actionLabel="Add Product"
      onAction={fn()}
    />
  ),
  name: 'Empty - With Resource Name',
}

/**
 * Empty with custom icon
 */
export const EmptyCustomIcon: StoryObj<typeof Empty> = {
  render: () => (
    <Empty
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/50"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      }
      message="No comments yet"
      description="Be the first to leave a comment."
    />
  ),
  name: 'Empty - Custom Icon',
}

/**
 * All empty icon variants
 */
export const EmptyAllIcons: StoryObj<typeof Empty> = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Empty icon="inbox" message="Inbox" />
      <Empty icon="search" message="Search" />
      <Empty icon="file" message="File" />
      <Empty icon="folder" message="Folder" />
      <Empty icon="users" message="Users" />
    </div>
  ),
  name: 'Empty - All Icon Variants',
}

// =============================================================================
// Confirm Dialog Stories
// =============================================================================

/**
 * Basic confirmation dialog
 */
export const ConfirmBasic: StoryObj<typeof Confirm> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <Confirm
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Confirm action"
          message="Are you sure you want to proceed with this action?"
        />
      </>
    )
  },
  name: 'Confirm - Basic',
}

/**
 * Delete confirmation (destructive)
 */
export const ConfirmDelete: StoryObj<typeof Confirm> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Item
        </Button>
        <Confirm
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Delete item?"
          message="This action cannot be undone. This will permanently delete the item and all associated data."
          confirmLabel="Delete"
          confirmVariant="destructive"
        />
      </>
    )
  },
  name: 'Confirm - Delete (Destructive)',
}

/**
 * Confirmation with loading state
 */
export const ConfirmWithLoading: StoryObj<typeof Confirm> = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setLoading(false)
      setOpen(false)
    }

    return (
      <>
        <Button onClick={() => setOpen(true)}>Save Changes</Button>
        <Confirm
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
          loading={loading}
          title="Save changes?"
          message="Your changes will be saved to the server."
          confirmLabel="Save"
        />
      </>
    )
  },
  name: 'Confirm - With Loading State',
}

/**
 * Confirmation with custom content
 */
export const ConfirmCustomContent: StoryObj<typeof Confirm> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Archive Items</Button>
        <Confirm
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Archive 5 items?"
          confirmLabel="Archive"
          confirmVariant="secondary"
        >
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>The following items will be archived:</p>
            <ul className="list-disc list-inside">
              <li>Report Q1 2024</li>
              <li>Report Q2 2024</li>
              <li>Sales Summary</li>
              <li>Meeting Notes</li>
              <li>Project Plan</li>
            </ul>
            <p className="mt-2">You can restore them from the archive later.</p>
          </div>
        </Confirm>
      </>
    )
  },
  name: 'Confirm - Custom Content',
}

/**
 * Confirmation with custom labels
 */
export const ConfirmCustomLabels: StoryObj<typeof Confirm> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Discard Draft</Button>
        <Confirm
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Discard changes?"
          message="You have unsaved changes. Are you sure you want to discard them?"
          confirmLabel="Discard"
          cancelLabel="Keep editing"
          confirmVariant="destructive"
        />
      </>
    )
  },
  name: 'Confirm - Custom Labels',
}

// =============================================================================
// Notification Stories
// =============================================================================

/**
 * Success notification
 */
export const NotificationSuccess: StoryObj<typeof NotificationToast> = {
  render: () => (
    <div className="w-96">
      <NotificationToast
        id="1"
        message="Item saved successfully!"
        type="success"
        autoHideDuration={0}
        onDismiss={fn()}
      />
    </div>
  ),
  name: 'Notification - Success',
}

/**
 * Error notification
 */
export const NotificationError: StoryObj<typeof NotificationToast> = {
  render: () => (
    <div className="w-96">
      <NotificationToast
        id="2"
        message="Failed to save item. Please try again."
        type="error"
        autoHideDuration={0}
        onDismiss={fn()}
      />
    </div>
  ),
  name: 'Notification - Error',
}

/**
 * Warning notification
 */
export const NotificationWarning: StoryObj<typeof NotificationToast> = {
  render: () => (
    <div className="w-96">
      <NotificationToast
        id="3"
        message="Your session will expire in 5 minutes."
        type="warning"
        autoHideDuration={0}
        onDismiss={fn()}
      />
    </div>
  ),
  name: 'Notification - Warning',
}

/**
 * Info notification
 */
export const NotificationInfo: StoryObj<typeof NotificationToast> = {
  render: () => (
    <div className="w-96">
      <NotificationToast
        id="4"
        message="A new version is available. Please refresh."
        type="info"
        autoHideDuration={0}
        onDismiss={fn()}
      />
    </div>
  ),
  name: 'Notification - Info',
}

/**
 * All notification variants
 */
export const NotificationAllVariants: StoryObj<typeof NotificationToast> = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <NotificationToast
        id="1"
        message="Operation completed successfully!"
        type="success"
        autoHideDuration={0}
        onDismiss={fn()}
      />
      <NotificationToast
        id="2"
        message="An error occurred while processing your request."
        type="error"
        autoHideDuration={0}
        onDismiss={fn()}
      />
      <NotificationToast
        id="3"
        message="Warning: This action cannot be undone."
        type="warning"
        autoHideDuration={0}
        onDismiss={fn()}
      />
      <NotificationToast
        id="4"
        message="Tip: You can use keyboard shortcuts for faster navigation."
        type="info"
        autoHideDuration={0}
        onDismiss={fn()}
      />
    </div>
  ),
  name: 'Notification - All Variants',
}

/**
 * Notification with undo action
 */
export const NotificationWithUndo: StoryObj<typeof NotificationToast> = {
  render: () => (
    <div className="w-96">
      <NotificationToast
        id="5"
        message="Item deleted"
        type="info"
        autoHideDuration={0}
        undoable
        onUndo={fn()}
        onDismiss={fn()}
      />
    </div>
  ),
  name: 'Notification - With Undo',
}

/**
 * Stacked notifications container
 */
export const NotificationStacked: StoryObj<typeof NotificationContainer> = {
  render: () => {
    const [notifications, setNotifications] = useState<
      Array<{ id: string; message: string; options: { type: 'success' | 'error' | 'warning' | 'info' } }>
    >([
      { id: '1', message: 'File uploaded successfully', options: { type: 'success' } },
      { id: '2', message: 'Processing your request...', options: { type: 'info' } },
      { id: '3', message: 'Warning: Large file detected', options: { type: 'warning' } },
    ])

    const handleDismiss = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const handleAddNotification = () => {
      const types = ['success', 'error', 'warning', 'info'] as const
      const messages = [
        'New notification added!',
        'Something happened',
        'Action completed',
        'Update available',
      ]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)] ?? 'New notification'
      const randomType = types[Math.floor(Math.random() * types.length)] ?? 'info'
      setNotifications((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          message: randomMessage,
          options: { type: randomType },
        },
      ])
    }

    return (
      <div className="relative min-h-[400px] w-full">
        <Button onClick={handleAddNotification}>Add Notification</Button>
        <NotificationContainer
          notifications={notifications}
          onDismiss={handleDismiss}
          position="top-right"
        />
      </div>
    )
  },
  name: 'Notification - Stacked Container',
}

/**
 * Interactive notification demo
 */
export const NotificationInteractive: StoryObj = {
  render: () => {
    const [notifications, setNotifications] = useState<
      Array<{
        id: string
        message: string
        options: {
          type: 'success' | 'error' | 'warning' | 'info'
          undoable?: boolean
          onUndo?: () => void
        }
      }>
    >([])

    const addNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
      const messages = {
        success: 'Operation completed successfully!',
        error: 'An error occurred. Please try again.',
        warning: 'Please review your changes before saving.',
        info: 'New update available.',
      }

      setNotifications((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          message: messages[type],
          options: { type },
        },
      ])
    }

    const addUndoableNotification = () => {
      const id = String(Date.now())
      setNotifications((prev) => [
        ...prev,
        {
          id,
          message: 'Item deleted',
          options: {
            type: 'info',
            undoable: true,
            onUndo: () => console.log('Undo clicked!'),
          },
        },
      ])
    }

    const handleDismiss = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    return (
      <div className="relative min-h-[500px] w-full">
        <div className="flex flex-wrap gap-2 p-4">
          <Button onClick={() => addNotification('success')}>
            Show Success
          </Button>
          <Button variant="destructive" onClick={() => addNotification('error')}>
            Show Error
          </Button>
          <Button variant="outline" onClick={() => addNotification('warning')}>
            Show Warning
          </Button>
          <Button variant="secondary" onClick={() => addNotification('info')}>
            Show Info
          </Button>
          <Button variant="ghost" onClick={addUndoableNotification}>
            Delete with Undo
          </Button>
        </div>
        <NotificationContainer
          notifications={notifications}
          onDismiss={handleDismiss}
          position="top-right"
        />
      </div>
    )
  },
  name: 'Notification - Interactive Demo',
}

// =============================================================================
// Combined Showcase
// =============================================================================

/**
 * All feedback components showcased together
 */
export const FeedbackShowcase: StoryObj = {
  render: () => {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [notifications, setNotifications] = useState<
      Array<{ id: string; message: string; options: { type: 'success' | 'error' | 'warning' | 'info' } }>
    >([])

    const addNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
      setNotifications((prev) => [
        ...prev,
        { id: String(Date.now()), message, options: { type } },
      ])
    }

    return (
      <div className="space-y-8 p-6">
        <h2 className="text-2xl font-bold">Feedback Components Showcase</h2>

        {/* Loading Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Loading States</h3>
          <div className="flex items-end gap-8 p-6 border rounded-lg">
            <Loading size="sm" text="Small" />
            <Loading size="default" text="Default" />
            <Loading size="lg" text="Large" />
            <Loading size="xl" text="Extra Large" />
          </div>
        </section>

        {/* Error Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Error States</h3>
          <div className="grid grid-cols-2 gap-4">
            <ErrorComponent error="Simple error message" />
            <ErrorComponent
              title="Failed to load"
              error="Network error: Connection refused"
              onRetry={() => addNotification('info', 'Retrying...')}
            />
          </div>
        </section>

        {/* Empty Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Empty States</h3>
          <div className="grid grid-cols-2 gap-4">
            <Empty
              icon="inbox"
              message="No messages"
              description="Your inbox is empty"
            />
            <Empty
              icon="search"
              resource="results"
              description="Try different search terms"
              actionLabel="Clear Search"
              onAction={() => addNotification('success', 'Search cleared!')}
            />
          </div>
        </section>

        {/* Confirm Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Confirmation Dialog</h3>
          <Button
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Delete Item
          </Button>
          <Confirm
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => {
              setConfirmOpen(false)
              addNotification('success', 'Item deleted successfully!')
            }}
            title="Delete this item?"
            message="This action cannot be undone."
            confirmLabel="Delete"
            confirmVariant="destructive"
          />
        </section>

        {/* Notification Container */}
        <NotificationContainer
          notifications={notifications}
          onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
          position="top-right"
        />
      </div>
    )
  },
  name: 'All Feedback - Showcase',
}
