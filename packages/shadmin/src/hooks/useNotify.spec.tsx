/**
 * useNotify hook tests
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useNotify } from './useNotify'
import {
  NotificationContextProvider,
  useNotificationContext,
} from '../contexts/NotificationContext'

const createWrapper = () => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <NotificationContextProvider>{children}</NotificationContextProvider>
  }
}

describe('useNotify', () => {
  it('should return a notify function', () => {
    const { result } = renderHook(() => useNotify(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current).toBe('function')
  })

  it('should add a notification when called', () => {
    const { result } = renderHook(
      () => ({
        notify: useNotify(),
        context: useNotificationContext(),
      }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.notify('Test message')
    })

    expect(result.current.context.notifications).toHaveLength(1)
    expect(result.current.context.notifications[0].message).toBe('Test message')
  })

  it('should support success notification type', () => {
    const { result } = renderHook(
      () => ({
        notify: useNotify(),
        context: useNotificationContext(),
      }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.notify('Saved!', { type: 'success' })
    })

    expect(result.current.context.notifications[0].options?.type).toBe('success')
  })

  it('should support error notification type', () => {
    const { result } = renderHook(
      () => ({
        notify: useNotify(),
        context: useNotificationContext(),
      }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.notify('Error occurred', { type: 'error' })
    })

    expect(result.current.context.notifications[0].options?.type).toBe('error')
  })

  it('should support warning notification type', () => {
    const { result } = renderHook(
      () => ({
        notify: useNotify(),
        context: useNotificationContext(),
      }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.notify('Warning', { type: 'warning' })
    })

    expect(result.current.context.notifications[0].options?.type).toBe('warning')
  })

  it('should default to info type', () => {
    const { result } = renderHook(
      () => ({
        notify: useNotify(),
        context: useNotificationContext(),
      }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.notify('Info message')
    })

    expect(result.current.context.notifications[0].options?.type).toBe('info')
  })

  it('should support undoable option', () => {
    const onUndo = vi.fn()
    const { result } = renderHook(
      () => ({
        notify: useNotify(),
        context: useNotificationContext(),
      }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.notify('Deleted', { type: 'info', undoable: true, onUndo })
    })

    expect(result.current.context.notifications[0].options?.undoable).toBe(true)
    expect(result.current.context.notifications[0].options?.onUndo).toBe(onUndo)
  })

  it('should support autoHideDuration option', () => {
    const { result } = renderHook(
      () => ({
        notify: useNotify(),
        context: useNotificationContext(),
      }),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.notify('Quick message', { autoHideDuration: 2000 })
    })

    expect(result.current.context.notifications[0].options?.autoHideDuration).toBe(2000)
  })

  it('should throw error when used outside NotificationContextProvider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useNotify())
    }).toThrow('useNotify must be used inside a NotificationContextProvider')

    errorSpy.mockRestore()
  })
})
