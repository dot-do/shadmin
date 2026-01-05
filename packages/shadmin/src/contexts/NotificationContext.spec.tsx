import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  NotificationContext,
  NotificationContextProvider,
  useNotify,
  useNotificationContext,
  type NotificationType,
  type NotificationOptions,
} from './NotificationContext'

describe('NotificationContext', () => {
  describe('NotificationContext', () => {
    it('should export the React context', () => {
      expect(NotificationContext).toBeDefined()
    })
  })

  describe('NotificationContextProvider', () => {
    it('should provide notification context to children', () => {
      const Consumer = () => {
        const notify = useNotify()
        return (
          <button onClick={() => notify('Test message', { type: 'success' })}>
            Notify
          </button>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      expect(screen.getByText('Notify')).toBeInTheDocument()
    })
  })

  describe('useNotify', () => {
    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useNotify()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useNotify must be used inside a NotificationContextProvider'
      )
    })

    it('should call notify with message and options', () => {
      let capturedNotifications: Array<{ message: string; options?: NotificationOptions }> = []

      const Consumer = () => {
        const notify = useNotify()
        const { notifications } = useNotificationContext()

        // Capture notifications whenever they change
        capturedNotifications = notifications

        return (
          <div>
            <button onClick={() => notify('Hello World', { type: 'success' })}>
              Success
            </button>
            <button onClick={() => notify('Error occurred', { type: 'error' })}>
              Error
            </button>
            <button onClick={() => notify('Warning!', { type: 'warning' })}>
              Warning
            </button>
            <button onClick={() => notify('Info message')}>
              Info
            </button>
          </div>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Success'))
      })

      expect(capturedNotifications.length).toBe(1)
      expect(capturedNotifications[0].message).toBe('Hello World')
      expect(capturedNotifications[0].options?.type).toBe('success')
    })

    it('should support all notification types', () => {
      const types: NotificationType[] = ['info', 'success', 'warning', 'error']
      let capturedType: NotificationType | undefined

      const Consumer = ({ type }: { type: NotificationType }) => {
        const notify = useNotify()
        const { notifications } = useNotificationContext()

        if (notifications.length > 0) {
          capturedType = notifications[0].options?.type
        }

        return (
          <button onClick={() => notify('Message', { type })}>
            Notify
          </button>
        )
      }

      for (const type of types) {
        const { unmount } = render(
          <NotificationContextProvider>
            <Consumer type={type} />
          </NotificationContextProvider>
        )

        act(() => {
          fireEvent.click(screen.getByText('Notify'))
        })

        expect(capturedType).toBe(type)
        unmount()
        capturedType = undefined
      }
    })

    it('should support auto-hide duration option', () => {
      let capturedDuration: number | undefined

      const Consumer = () => {
        const notify = useNotify()
        const { notifications } = useNotificationContext()

        if (notifications.length > 0) {
          capturedDuration = notifications[0].options?.autoHideDuration
        }

        return (
          <button onClick={() => notify('Message', { autoHideDuration: 5000 })}>
            Notify
          </button>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Notify'))
      })

      expect(capturedDuration).toBe(5000)
    })

    it('should support undoable option', () => {
      let capturedUndoable: boolean | undefined
      let capturedOnUndo: (() => void) | undefined

      const Consumer = () => {
        const notify = useNotify()
        const { notifications } = useNotificationContext()

        if (notifications.length > 0) {
          capturedUndoable = notifications[0].options?.undoable
          capturedOnUndo = notifications[0].options?.onUndo
        }

        const handleUndo = () => {
          // Undo logic here
        }

        return (
          <button onClick={() => notify('Item deleted', { undoable: true, onUndo: handleUndo })}>
            Delete
          </button>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Delete'))
      })

      expect(capturedUndoable).toBe(true)
      expect(typeof capturedOnUndo).toBe('function')
    })

    it('should default to info type when not specified', () => {
      let capturedType: NotificationType | undefined

      const Consumer = () => {
        const notify = useNotify()
        const { notifications } = useNotificationContext()

        if (notifications.length > 0) {
          capturedType = notifications[0].options?.type ?? 'info'
        }

        return (
          <button onClick={() => notify('Plain message')}>
            Notify
          </button>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Notify'))
      })

      // Default should be info
      expect(capturedType).toBe('info')
    })
  })

  describe('useNotificationContext', () => {
    it('should throw error when used outside provider', () => {
      const Consumer = () => {
        useNotificationContext()
        return null
      }

      expect(() => render(<Consumer />)).toThrow(
        'useNotificationContext must be used inside a NotificationContextProvider'
      )
    })

    it('should provide notifications array and dismiss function', () => {
      const Consumer = () => {
        const { notifications, dismiss, dismissAll } = useNotificationContext()

        return (
          <div>
            <span data-testid="hasNotifications">{Array.isArray(notifications) ? 'true' : 'false'}</span>
            <span data-testid="hasDismiss">{typeof dismiss === 'function' ? 'true' : 'false'}</span>
            <span data-testid="hasDismissAll">{typeof dismissAll === 'function' ? 'true' : 'false'}</span>
          </div>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      expect(screen.getByTestId('hasNotifications')).toHaveTextContent('true')
      expect(screen.getByTestId('hasDismiss')).toHaveTextContent('true')
      expect(screen.getByTestId('hasDismissAll')).toHaveTextContent('true')
    })

    it('should dismiss specific notification', () => {
      const Consumer = () => {
        const notify = useNotify()
        const { notifications, dismiss } = useNotificationContext()

        return (
          <div>
            <button onClick={() => notify('Message 1')}>Add 1</button>
            <button onClick={() => notify('Message 2')}>Add 2</button>
            <button onClick={() => notifications.length > 0 && dismiss(notifications[0].id)}>
              Dismiss First
            </button>
            <span data-testid="count">{notifications.length}</span>
          </div>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Add 1'))
        fireEvent.click(screen.getByText('Add 2'))
      })

      expect(screen.getByTestId('count')).toHaveTextContent('2')

      act(() => {
        fireEvent.click(screen.getByText('Dismiss First'))
      })

      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })

    it('should dismiss all notifications', () => {
      const Consumer = () => {
        const notify = useNotify()
        const { notifications, dismissAll } = useNotificationContext()

        return (
          <div>
            <button onClick={() => notify('Message 1')}>Add 1</button>
            <button onClick={() => notify('Message 2')}>Add 2</button>
            <button onClick={dismissAll}>Dismiss All</button>
            <span data-testid="count">{notifications.length}</span>
          </div>
        )
      }

      render(
        <NotificationContextProvider>
          <Consumer />
        </NotificationContextProvider>
      )

      act(() => {
        fireEvent.click(screen.getByText('Add 1'))
        fireEvent.click(screen.getByText('Add 2'))
      })

      expect(screen.getByTestId('count')).toHaveTextContent('2')

      act(() => {
        fireEvent.click(screen.getByText('Dismiss All'))
      })

      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })
  })
})
