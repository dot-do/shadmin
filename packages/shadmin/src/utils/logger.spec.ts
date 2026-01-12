import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, setErrorHandler, reportError, type ErrorHandler } from './logger'

describe('logger', () => {
  const originalEnv = process.env.NODE_ENV
  const originalConsoleLog = console.log
  const originalConsoleWarn = console.warn
  const originalConsoleError = console.error

  beforeEach(() => {
    console.log = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    console.log = originalConsoleLog
    console.warn = originalConsoleWarn
    console.error = originalConsoleError
  })

  describe('debug', () => {
    it('logs with [shadmin] prefix in development', () => {
      process.env.NODE_ENV = 'development'
      logger.debug('test message', { data: 123 })
      expect(console.log).toHaveBeenCalledWith('[shadmin]', 'test message', { data: 123 })
    })

    it('does not log in production', () => {
      process.env.NODE_ENV = 'production'
      logger.debug('test message')
      expect(console.log).not.toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('logs with [shadmin] prefix in development', () => {
      process.env.NODE_ENV = 'development'
      logger.warn('warning message')
      expect(console.warn).toHaveBeenCalledWith('[shadmin]', 'warning message')
    })

    it('does not log in production', () => {
      process.env.NODE_ENV = 'production'
      logger.warn('warning message')
      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('logs with [shadmin] prefix in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('test error')
      logger.error('error occurred', error)
      expect(console.error).toHaveBeenCalledWith('[shadmin]', 'error occurred', error)
    })

    it('logs with [shadmin] prefix in production', () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('test error')
      logger.error('error occurred', error)
      expect(console.error).toHaveBeenCalledWith('[shadmin]', 'error occurred', error)
    })
  })

  describe('setErrorHandler and reportError', () => {
    it('calls custom error handler when set', () => {
      const customHandler: ErrorHandler = vi.fn()
      setErrorHandler(customHandler)

      const error = new Error('test')
      const context = { userId: '123' }
      reportError(error, context)

      expect(console.error).toHaveBeenCalledWith('[shadmin]', error)
      expect(customHandler).toHaveBeenCalledWith(error, context)
    })

    it('works without custom handler', () => {
      // Reset handler by setting a new one that doesn't call custom
      setErrorHandler(() => {})

      const error = new Error('test')
      reportError(error)

      expect(console.error).toHaveBeenCalledWith('[shadmin]', error)
    })
  })
})
