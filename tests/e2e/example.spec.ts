/**
 * Example E2E test for shadmin
 * This file demonstrates the basic structure of Playwright tests
 */

import { test, expect } from '@playwright/test'

test.describe('Example Tests', () => {
  test('has title', async ({ page }) => {
    await page.goto('/')

    // Expect the page to have a title
    await expect(page).toHaveTitle(/.*/)
  })

  test('can navigate the application', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to be ready
    await page.waitForLoadState('networkidle')

    // Take a screenshot for visual reference
    await page.screenshot({ path: 'test-results/home-page.png' })
  })
})

test.describe('Authentication', () => {
  test.skip('can log in with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in login form
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', 'password')

    // Submit the form
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard.*/)
  })

  test.skip('shows error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in login form with invalid credentials
    await page.fill('[name="username"]', 'invalid')
    await page.fill('[name="password"]', 'invalid')

    // Submit the form
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test.skip('can navigate to resources', async ({ page }) => {
    await page.goto('/')

    // Click on a resource link
    await page.click('a[href*="users"]')

    // Should show the users list
    await expect(page).toHaveURL(/.*users.*/)
  })
})

test.describe('Accessibility', () => {
  test.skip('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/')

    // Note: To run accessibility tests, install @axe-core/playwright
    // const { injectAxe, checkA11y } = await import('@axe-core/playwright')
    // await injectAxe(page)
    // await checkA11y(page)
  })
})
