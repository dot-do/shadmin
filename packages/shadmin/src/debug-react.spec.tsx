/**
 * Debug test to identify React resolution issue
 */
import { render, screen } from '@testing-library/react'
import React, { useContext, createContext } from 'react'
import { describe, it, expect } from 'vitest'

// Log React module location
console.log('React version:', React.version)
console.log('React location:', require.resolve('react'))

// Create a simple context
const TestContext = createContext<string | null>(null)

function TestComponent() {
  const value = useContext(TestContext)
  return <div data-testid="result">{value ?? 'no-context'}</div>
}

describe('React Debug', () => {
  it('should use context correctly', () => {
    render(
      <TestContext.Provider value="hello">
        <TestComponent />
      </TestContext.Provider>
    )
    expect(screen.getByTestId('result')).toHaveTextContent('hello')
  })

  it('should show no-context when outside provider', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('result')).toHaveTextContent('no-context')
  })
})
