/**
 * useRedirect hook tests
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { useRedirect } from './useRedirect'

const createWrapper = (initialEntries: string[] = ['/']) => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  }
}

describe('useRedirect', () => {
  it('should return a redirect function', () => {
    const { result } = renderHook(() => useRedirect(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current).toBe('function')
  })

  it('should redirect to list view', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/posts/1/edit']) }
    )

    act(() => {
      result.current.redirect('list', 'posts')
    })

    expect(result.current.location.pathname).toBe('/posts')
  })

  it('should redirect to show view with id', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/posts']) }
    )

    act(() => {
      result.current.redirect('show', 'posts', 123)
    })

    expect(result.current.location.pathname).toBe('/posts/123/show')
  })

  it('should redirect to edit view with id', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/posts']) }
    )

    act(() => {
      result.current.redirect('edit', 'posts', 456)
    })

    expect(result.current.location.pathname).toBe('/posts/456')
  })

  it('should redirect to create view', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/posts']) }
    )

    act(() => {
      result.current.redirect('create', 'posts')
    })

    expect(result.current.location.pathname).toBe('/posts/create')
  })

  it('should redirect to custom path string', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/']) }
    )

    act(() => {
      result.current.redirect('/custom/path')
    })

    expect(result.current.location.pathname).toBe('/custom/path')
  })

  it('should handle false to prevent redirect', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/original']) }
    )

    act(() => {
      result.current.redirect(false)
    })

    // Should remain on original path
    expect(result.current.location.pathname).toBe('/original')
  })

  it('should support numeric string IDs', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/posts']) }
    )

    act(() => {
      result.current.redirect('edit', 'posts', '789')
    })

    expect(result.current.location.pathname).toBe('/posts/789')
  })

  it('should redirect to base path when using basePath option', () => {
    const { result } = renderHook(
      () => ({
        redirect: useRedirect(),
        location: useLocation(),
      }),
      { wrapper: createWrapper(['/admin/posts']) }
    )

    act(() => {
      result.current.redirect('list', 'posts', undefined, { basePath: '/admin' })
    })

    expect(result.current.location.pathname).toBe('/admin/posts')
  })
})
