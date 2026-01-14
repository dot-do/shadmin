/**
 * Component Re-render Performance Benchmarks
 *
 * Measures re-render performance of key shadmin components.
 * These benchmarks help identify unnecessary re-renders and optimization opportunities.
 */

import { describe, bench } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createElement, useState, useCallback, useMemo, memo, type ReactNode } from 'react'

import type { RaRecord } from '../src/types'

interface BenchmarkRecord extends RaRecord {
  id: number
  name: string
  email: string
  status: string
  amount: number
}

/**
 * Generate mock records
 */
function generateRecords(count: number): BenchmarkRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 2 === 0 ? 'active' : 'inactive',
    amount: Math.random() * 10000,
  }))
}

// Pre-generate test data
const records100 = generateRecords(100)
const records1000 = generateRecords(1000)

describe('Re-render - Row Component Patterns', () => {
  // Simulate row component rendering patterns

  interface RowProps {
    record: BenchmarkRecord
    index: number
    onClick?: (record: BenchmarkRecord) => void
  }

  // Non-memoized row
  function Row({ record, index, onClick }: RowProps) {
    return {
      key: record.id,
      index,
      content: `${record.name} - ${record.email}`,
      onClick: onClick ? () => onClick(record) : undefined,
    }
  }

  // Memoized row
  const MemoizedRow = memo(function MemoizedRow({ record, index, onClick }: RowProps) {
    return {
      key: record.id,
      index,
      content: `${record.name} - ${record.email}`,
      onClick: onClick ? () => onClick(record) : undefined,
    }
  })

  bench('render 100 rows - non-memoized', () => {
    const onClick = (record: BenchmarkRecord) => record.id
    return records100.map((record, index) =>
      Row({ record, index, onClick })
    )
  })

  bench('render 100 rows - memoized (creation)', () => {
    const onClick = (record: BenchmarkRecord) => record.id
    return records100.map((record, index) =>
      createElement(MemoizedRow, { key: record.id, record, index, onClick })
    )
  })

  bench('render 1000 rows - non-memoized', () => {
    const onClick = (record: BenchmarkRecord) => record.id
    return records1000.map((record, index) =>
      Row({ record, index, onClick })
    )
  })
})

describe('Re-render - Cell Rendering', () => {
  // Simulate cell rendering patterns

  interface CellProps {
    value: unknown
    record: BenchmarkRecord
    column: string
  }

  function renderCell({ value, record, column }: CellProps) {
    switch (column) {
      case 'amount':
        return `$${Number(value).toFixed(2)}`
      case 'status':
        return { text: value, className: value === 'active' ? 'text-green' : 'text-red' }
      case 'email':
        return { text: value, href: `mailto:${value}` }
      default:
        return String(value)
    }
  }

  bench('render all cells - 100 rows x 5 columns', () => {
    const columns = ['id', 'name', 'email', 'status', 'amount'] as const
    const results: unknown[] = []

    for (const record of records100) {
      for (const column of columns) {
        results.push(renderCell({
          value: record[column as keyof BenchmarkRecord],
          record,
          column,
        }))
      }
    }
    return results
  })

  bench('render all cells - 1000 rows x 5 columns', () => {
    const columns = ['id', 'name', 'email', 'status', 'amount'] as const
    const results: unknown[] = []

    for (const record of records1000) {
      for (const column of columns) {
        results.push(renderCell({
          value: record[column as keyof BenchmarkRecord],
          record,
          column,
        }))
      }
    }
    return results
  })
})

describe('Re-render - Selection Updates', () => {
  // Simulate selection state changes and their render impact

  function useSelectionState(initialData: BenchmarkRecord[]) {
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const isSelected = useCallback(
      (id: number) => selectedIds.includes(id),
      [selectedIds]
    )

    const toggle = useCallback((id: number) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    }, [])

    const selectAll = useCallback(() => {
      setSelectedIds(initialData.map((r) => r.id))
    }, [initialData])

    const unselectAll = useCallback(() => {
      setSelectedIds([])
    }, [])

    // Memoized selection state for rows
    const rowSelectionState = useMemo(() => {
      const state: Record<number, boolean> = {}
      for (const record of initialData) {
        state[record.id] = selectedIds.includes(record.id)
      }
      return state
    }, [selectedIds, initialData])

    return {
      selectedIds,
      isSelected,
      toggle,
      selectAll,
      unselectAll,
      rowSelectionState,
    }
  }

  bench('toggle selection - single item', () => {
    const { result } = renderHook(() => useSelectionState(records100))
    act(() => result.current.toggle(50))
  })

  bench('toggle selection - 50 items sequentially', () => {
    const { result } = renderHook(() => useSelectionState(records100))
    for (let i = 1; i <= 50; i++) {
      act(() => result.current.toggle(i))
    }
  })

  bench('select all then unselect all', () => {
    const { result } = renderHook(() => useSelectionState(records100))
    act(() => result.current.selectAll())
    act(() => result.current.unselectAll())
  })

  bench('check selection state - 100 items', () => {
    const { result } = renderHook(() => useSelectionState(records100))
    act(() => result.current.selectAll())

    let count = 0
    for (const record of records100) {
      if (result.current.isSelected(record.id)) {
        count++
      }
    }
    return count
  })

  bench('build row selection state - 1000 items', () => {
    const { result } = renderHook(() => useSelectionState(records1000))
    // Select every 10th item
    for (let i = 0; i < 100; i++) {
      act(() => result.current.toggle(i * 10 + 1))
    }
    return result.current.rowSelectionState
  })
})

describe('Re-render - Data Updates', () => {
  // Simulate data updates and their render impact

  function useDataState(initialData: BenchmarkRecord[]) {
    const [data, setData] = useState(initialData)

    const updateRecord = useCallback((id: number, updates: Partial<BenchmarkRecord>) => {
      setData((prev) =>
        prev.map((record) =>
          record.id === id ? { ...record, ...updates } : record
        )
      )
    }, [])

    const addRecord = useCallback((record: BenchmarkRecord) => {
      setData((prev) => [...prev, record])
    }, [])

    const removeRecord = useCallback((id: number) => {
      setData((prev) => prev.filter((record) => record.id !== id))
    }, [])

    const replaceAll = useCallback((newData: BenchmarkRecord[]) => {
      setData(newData)
    }, [])

    return { data, updateRecord, addRecord, removeRecord, replaceAll }
  }

  bench('update single record', () => {
    const { result } = renderHook(() => useDataState(records100))
    act(() => {
      result.current.updateRecord(50, { status: 'updated' })
    })
  })

  bench('update 10 records sequentially', () => {
    const { result } = renderHook(() => useDataState(records100))
    for (let i = 1; i <= 10; i++) {
      act(() => {
        result.current.updateRecord(i * 10, { status: 'updated' })
      })
    }
  })

  bench('replace all data - 100 records', () => {
    const { result } = renderHook(() => useDataState(records100))
    const newData = generateRecords(100)
    act(() => {
      result.current.replaceAll(newData)
    })
  })

  bench('replace all data - 1000 records', () => {
    const { result } = renderHook(() => useDataState(records1000))
    const newData = generateRecords(1000)
    act(() => {
      result.current.replaceAll(newData)
    })
  })

  bench('add record to end', () => {
    const { result } = renderHook(() => useDataState(records100))
    act(() => {
      result.current.addRecord({
        id: 101,
        name: 'New User',
        email: 'new@example.com',
        status: 'active',
        amount: 1000,
      })
    })
  })

  bench('remove record from middle', () => {
    const { result } = renderHook(() => useDataState(records100))
    act(() => {
      result.current.removeRecord(50)
    })
  })
})

describe('Re-render - Virtual List Simulation', () => {
  // Simulate virtual list rendering patterns

  interface VirtualRange {
    startIndex: number
    endIndex: number
    overscan: number
  }

  function calculateVisibleRange(
    containerHeight: number,
    rowHeight: number,
    scrollTop: number,
    totalItems: number,
    overscan: number = 3
  ): VirtualRange {
    const visibleCount = Math.ceil(containerHeight / rowHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan * 2)

    return { startIndex, endIndex, overscan }
  }

  bench('calculate visible range - 100 items', () => {
    return calculateVisibleRange(500, 40, 200, 100)
  })

  bench('calculate visible range - 10000 items', () => {
    return calculateVisibleRange(500, 40, 50000, 10000)
  })

  bench('render visible rows only - 1000 items, 20 visible', () => {
    const range = calculateVisibleRange(500, 40, 5000, 1000)
    const visibleRecords = records1000.slice(range.startIndex, range.endIndex + 1)

    return visibleRecords.map((record, localIndex) => ({
      key: record.id,
      absoluteIndex: range.startIndex + localIndex,
      style: { transform: `translateY(${(range.startIndex + localIndex) * 40}px)` },
      content: `${record.name} - ${record.email}`,
    }))
  })

  bench('scroll update - recalculate range', () => {
    // Simulate multiple scroll updates
    const results: VirtualRange[] = []
    for (let scrollTop = 0; scrollTop < 5000; scrollTop += 200) {
      results.push(calculateVisibleRange(500, 40, scrollTop, 1000))
    }
    return results
  })
})

describe('Re-render - Form Field Updates', () => {
  // Simulate form field re-render patterns

  interface FormState {
    values: Record<string, unknown>
    errors: Record<string, string | undefined>
    touched: Record<string, boolean>
    dirty: Record<string, boolean>
  }

  function useFormState(initialValues: Record<string, unknown>) {
    const [state, setState] = useState<FormState>({
      values: initialValues,
      errors: {},
      touched: {},
      dirty: {},
    })

    const setValue = useCallback((field: string, value: unknown) => {
      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [field]: value },
        dirty: { ...prev.dirty, [field]: value !== initialValues[field] },
      }))
    }, [initialValues])

    const setError = useCallback((field: string, error: string | undefined) => {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: error },
      }))
    }, [])

    const setTouched = useCallback((field: string) => {
      setState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [field]: true },
      }))
    }, [])

    return { state, setValue, setError, setTouched }
  }

  const initialFormValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    bio: '',
    website: '',
    company: '',
  }

  bench('update single field value', () => {
    const { result } = renderHook(() => useFormState(initialFormValues))
    act(() => {
      result.current.setValue('name', 'John Doe')
    })
  })

  bench('update multiple fields sequentially', () => {
    const { result } = renderHook(() => useFormState(initialFormValues))
    act(() => result.current.setValue('name', 'John Doe'))
    act(() => result.current.setValue('email', 'john@example.com'))
    act(() => result.current.setValue('phone', '+1-555-0123'))
    act(() => result.current.setValue('city', 'New York'))
  })

  bench('set validation error', () => {
    const { result } = renderHook(() => useFormState(initialFormValues))
    act(() => {
      result.current.setError('email', 'Invalid email format')
    })
  })

  bench('mark all fields touched', () => {
    const { result } = renderHook(() => useFormState(initialFormValues))
    for (const field of Object.keys(initialFormValues)) {
      act(() => {
        result.current.setTouched(field)
      })
    }
  })
})
