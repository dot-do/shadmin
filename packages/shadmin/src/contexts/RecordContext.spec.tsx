import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  RecordContext,
  RecordContextProvider,
  useRecordContext,
} from './RecordContext'

interface TestRecord {
  id: number
  name: string
  email: string
  [key: string]: unknown
}

describe('RecordContext', () => {
  describe('RecordContext', () => {
    it('should export the React context', () => {
      expect(RecordContext).toBeDefined()
    })
  })

  describe('RecordContextProvider', () => {
    it('should provide a record to children', () => {
      const testRecord: TestRecord = { id: 1, name: 'John', email: 'john@example.com.ai' }

      const Consumer = () => {
        const record = useRecordContext<TestRecord>()
        return <div data-testid="record">{record?.name}</div>
      }

      render(
        <RecordContextProvider value={testRecord}>
          <Consumer />
        </RecordContextProvider>
      )

      expect(screen.getByTestId('record')).toHaveTextContent('John')
    })

    it('should allow nested providers with different records', () => {
      const outerRecord: TestRecord = { id: 1, name: 'Outer', email: 'outer@example.com.ai' }
      const innerRecord: TestRecord = { id: 2, name: 'Inner', email: 'inner@example.com.ai' }

      const Consumer = () => {
        const record = useRecordContext<TestRecord>()
        return <div data-testid="record">{record?.name}</div>
      }

      render(
        <RecordContextProvider value={outerRecord}>
          <RecordContextProvider value={innerRecord}>
            <Consumer />
          </RecordContextProvider>
        </RecordContextProvider>
      )

      expect(screen.getByTestId('record')).toHaveTextContent('Inner')
    })
  })

  describe('useRecordContext', () => {
    it('should return undefined when used outside provider', () => {
      const Consumer = () => {
        const record = useRecordContext<TestRecord>()
        return <div data-testid="record">{record === undefined ? 'undefined' : 'defined'}</div>
      }

      render(<Consumer />)

      expect(screen.getByTestId('record')).toHaveTextContent('undefined')
    })

    it('should return the record with proper typing', () => {
      const testRecord: TestRecord = { id: 1, name: 'Test', email: 'test@example.com.ai' }

      const Consumer = () => {
        const record = useRecordContext<TestRecord>()
        // TypeScript should recognize these properties
        return (
          <div>
            <span data-testid="id">{record?.id}</span>
            <span data-testid="name">{record?.name}</span>
            <span data-testid="email">{record?.email}</span>
          </div>
        )
      }

      render(
        <RecordContextProvider value={testRecord}>
          <Consumer />
        </RecordContextProvider>
      )

      expect(screen.getByTestId('id')).toHaveTextContent('1')
      expect(screen.getByTestId('name')).toHaveTextContent('Test')
      expect(screen.getByTestId('email')).toHaveTextContent('test@example.com.ai')
    })

    it('should work without generic type parameter', () => {
      const testRecord = { id: 1, customField: 'value' }

      const Consumer = () => {
        const record = useRecordContext()
        return <div data-testid="record">{JSON.stringify(record)}</div>
      }

      render(
        <RecordContextProvider value={testRecord}>
          <Consumer />
        </RecordContextProvider>
      )

      expect(screen.getByTestId('record')).toHaveTextContent(JSON.stringify(testRecord))
    })
  })
})
