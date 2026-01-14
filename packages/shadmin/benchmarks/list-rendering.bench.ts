/**
 * List Rendering Performance Benchmarks
 *
 * Measures rendering performance of Datagrid component with varying data sizes.
 * These benchmarks help track performance regressions in list rendering.
 */

import { describe, bench } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createElement, type ReactElement } from 'react'
import { useReactTable, getCoreRowModel, type ColumnDef } from '@tanstack/react-table'

import type { RaRecord } from '../src/types'

interface BenchmarkRecord extends RaRecord {
  id: number
  name: string
  email: string
  status: string
  createdAt: string
  amount: number
}

/**
 * Generate mock records for benchmarking
 */
function generateRecords(count: number): BenchmarkRecord[] {
  const records: BenchmarkRecord[] = []
  const statuses = ['active', 'inactive', 'pending', 'completed']

  for (let i = 0; i < count; i++) {
    records.push({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: statuses[i % statuses.length] as string,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      amount: Math.random() * 10000,
    })
  }

  return records
}

/**
 * Create column definitions for benchmarking
 */
function createColumns(): ColumnDef<BenchmarkRecord>[] {
  return [
    { id: 'id', accessorKey: 'id', header: 'ID' },
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    { id: 'status', accessorKey: 'status', header: 'Status' },
    { id: 'createdAt', accessorKey: 'createdAt', header: 'Created' },
    { id: 'amount', accessorKey: 'amount', header: 'Amount' },
  ]
}

// Pre-generate datasets to avoid including generation time in benchmarks
const smallDataset = generateRecords(100)
const mediumDataset = generateRecords(1000)
const largeDataset = generateRecords(10000)
const columns = createColumns()

describe('List Rendering - TanStack Table Core', () => {
  bench('table initialization with 100 records', () => {
    const table = useReactTable({
      data: smallDataset,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
    // Force row model computation
    table.getRowModel()
  })

  bench('table initialization with 1,000 records', () => {
    const table = useReactTable({
      data: mediumDataset,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
    table.getRowModel()
  })

  bench('table initialization with 10,000 records', () => {
    const table = useReactTable({
      data: largeDataset,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
    table.getRowModel()
  })
})

describe('List Rendering - Row Model Computation', () => {
  // Create table instances outside the bench to measure only row model computation
  const smallTable = useReactTable({
    data: smallDataset,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const mediumTable = useReactTable({
    data: mediumDataset,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const largeTable = useReactTable({
    data: largeDataset,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  bench('get row model - 100 records', () => {
    smallTable.getRowModel()
  })

  bench('get row model - 1,000 records', () => {
    mediumTable.getRowModel()
  })

  bench('get row model - 10,000 records', () => {
    largeTable.getRowModel()
  })
})

describe('List Rendering - Cell Access Patterns', () => {
  const table = useReactTable({
    data: mediumDataset,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const rowModel = table.getRowModel()

  bench('iterate all cells - 1,000 records x 6 columns', () => {
    let total = 0
    for (const row of rowModel.rows) {
      for (const cell of row.getVisibleCells()) {
        // Simulate accessing cell value like render would
        const value = cell.getValue()
        if (value !== undefined) total++
      }
    }
    return total
  })

  bench('access first 50 rows (paginated view)', () => {
    const first50 = rowModel.rows.slice(0, 50)
    let total = 0
    for (const row of first50) {
      for (const cell of row.getVisibleCells()) {
        const value = cell.getValue()
        if (value !== undefined) total++
      }
    }
    return total
  })
})

describe('List Rendering - Selection Performance', () => {
  bench('build selection state - 100 selected from 1,000', () => {
    const selectedIds = new Set(mediumDataset.slice(0, 100).map((r) => r.id))
    const rowSelection: Record<string, boolean> = {}

    for (let i = 0; i < mediumDataset.length; i++) {
      const record = mediumDataset[i]
      if (record && selectedIds.has(record.id)) {
        rowSelection[i] = true
      }
    }
    return rowSelection
  })

  bench('check selection for each row - 1,000 records', () => {
    const selectedIds = new Set([1, 2, 3, 4, 5])
    let selected = 0

    for (const record of mediumDataset) {
      if (selectedIds.has(record.id)) {
        selected++
      }
    }
    return selected
  })
})
