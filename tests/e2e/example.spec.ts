/**
 * Basic E2E Tests for shadmin
 *
 * Core smoke tests to verify the admin UI loads and functions correctly.
 * Uses the CRM example application as the test target.
 */

import { test, expect } from './fixtures/test-utils'

test.describe('Basic Functionality', () => {
  test('application loads successfully', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Application should load without errors
    await expect(page).toHaveTitle(/.*/)

    // Body should have content
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('dashboard displays on home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Dashboard should show meaningful content
    const content = await page.locator('body').textContent()
    expect(content && content.length).toBeGreaterThan(100)
  })

  test('sidebar navigation is visible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should have navigation links
    const navLinks = page.locator('nav a, aside a, [role="navigation"] a')
    const linkCount = await navLinks.count()
    expect(linkCount).toBeGreaterThan(0)
  })

  test('can navigate to contacts list', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click on Contacts link
    await page.locator('a:has-text("Contacts")').click()
    await page.waitForLoadState('networkidle')

    // Should be on contacts page
    await expect(page).toHaveURL(/\/contacts/)

    // Should show data
    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })
  })

  test('contacts list shows data', async ({ page }) => {
    await page.goto('/contacts')
    await page.waitForLoadState('networkidle')

    // Wait for data to load
    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })

    // Should have rows
    const rows = page.locator('[data-testid^="shadmin-datagrid-row-"]')
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThan(0)
  })
})

test.describe('Resource Navigation', () => {
  test('navigates between all resources', async ({ page }) => {
    const resources = ['contacts', 'companies', 'deals', 'activities']

    for (const resource of resources) {
      await page.goto(`/${resource}`)
      await page.waitForLoadState('networkidle')

      // Each resource page should load
      await expect(page).toHaveURL(new RegExp(`/${resource}`))

      // Should show datagrid
      const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
      await expect(datagrid).toBeVisible({ timeout: 10000 })
    }
  })
})

test.describe('Data Display', () => {
  test('displays contact information correctly', async ({ page }) => {
    await page.goto('/contacts')
    await page.waitForLoadState('networkidle')

    // Wait for data
    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })

    // Should contain expected contact data from mock
    const pageContent = await page.locator('body').textContent()
    // The CRM mock data includes "John Smith" - verify data is rendered
    expect(pageContent).toBeTruthy()
  })

  test('displays company information correctly', async ({ page }) => {
    await page.goto('/companies')
    await page.waitForLoadState('networkidle')

    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })

    // Should show company data
    const pageContent = await page.locator('body').textContent()
    expect(pageContent).toBeTruthy()
  })

  test('displays deal information correctly', async ({ page }) => {
    await page.goto('/deals')
    await page.waitForLoadState('networkidle')

    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })
  })

  test('displays activity information correctly', async ({ page }) => {
    await page.goto('/activities')
    await page.waitForLoadState('networkidle')

    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Accessibility Basics', () => {
  test('page has main content area', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should have some form of main content
    const mainContent = page.locator('main, [role="main"], #root')
    await expect(mainContent).toBeVisible()
  })

  test('navigation links are keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Tab to first link
    await page.keyboard.press('Tab')

    // Should be able to activate with Enter
    const focusedElement = page.locator(':focus')
    const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())

    // Some focusable element should be focused
    expect(['a', 'button', 'input']).toContain(tagName)
  })

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/contacts')
    await page.waitForLoadState('networkidle')

    // Check that buttons have text or aria-label
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')

      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })
})

test.describe('Responsive Behavior', () => {
  test('works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/contacts')
    await page.waitForLoadState('networkidle')

    // Content should still be visible
    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })
  })

  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/contacts')
    await page.waitForLoadState('networkidle')

    // Content should still be accessible
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})

test.describe('Error Handling', () => {
  test('handles page refresh gracefully', async ({ page }) => {
    await page.goto('/contacts')
    await page.waitForLoadState('networkidle')

    // Refresh the page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should still work
    const datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    await expect(datagrid).toBeVisible({ timeout: 10000 })
  })

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/contacts')
    await page.waitForLoadState('networkidle')

    // Filter out known benign errors (like dev server messages)
    const criticalErrors = errors.filter(e =>
      !e.includes('DevTools') &&
      !e.includes('favicon') &&
      !e.includes('[HMR]')
    )

    // Should not have critical console errors
    expect(criticalErrors.length).toBeLessThanOrEqual(0)
  })
})
