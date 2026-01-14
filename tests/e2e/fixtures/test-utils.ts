/**
 * Shared test utilities for E2E tests
 *
 * Provides common page objects and helpers for testing shadmin components
 * through the CRM example application.
 */

import { test as base, expect, Page, Locator } from '@playwright/test'

/**
 * Page object for interacting with the List view
 */
export class ListPage {
  readonly page: Page
  readonly datagrid: Locator
  readonly rows: Locator
  readonly createButton: Locator
  readonly searchInput: Locator
  readonly title: Locator

  constructor(page: Page) {
    this.page = page
    this.datagrid = page.locator('[data-testid="shadmin-datagrid"]')
    this.rows = page.locator('[data-testid^="shadmin-datagrid-row-"]')
    this.createButton = page.locator('a[href$="/create"], button:has-text("Create")')
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')
    this.title = page.locator('h1, [data-testid="page-title"]')
  }

  async goto(resource: string) {
    await this.page.goto(`/${resource}`)
    await this.page.waitForLoadState('networkidle')
  }

  async waitForData() {
    await expect(this.datagrid).toBeVisible({ timeout: 10000 })
  }

  async getRowCount() {
    return this.rows.count()
  }

  async clickRow(index: number) {
    await this.rows.nth(index).click()
  }

  async sortBy(column: string) {
    await this.page.locator(`[data-testid="column-header-${column}"]`).click()
  }

  async search(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForTimeout(500) // Debounce
  }
}

/**
 * Page object for interacting with the Create view
 */
export class CreatePage {
  readonly page: Page
  readonly form: Locator
  readonly saveButton: Locator
  readonly cancelButton: Locator

  constructor(page: Page) {
    this.page = page
    this.form = page.locator('[data-testid="shadmin-form"], form')
    this.saveButton = page.locator('button[type="submit"], button:has-text("Save")')
    this.cancelButton = page.locator('a:has-text("Cancel"), button:has-text("Cancel")')
  }

  async goto(resource: string) {
    await this.page.goto(`/${resource}/create`)
    await this.page.waitForLoadState('networkidle')
  }

  async waitForForm() {
    await expect(this.form).toBeVisible({ timeout: 10000 })
  }

  async fillField(name: string, value: string) {
    const input = this.page.locator(`[name="${name}"], [data-testid="input-${name}"]`)
    await input.fill(value)
  }

  async selectField(name: string, value: string) {
    const select = this.page.locator(`[name="${name}"], [data-testid="select-${name}"]`)
    await select.click()
    await this.page.locator(`[role="option"]:has-text("${value}")`).click()
  }

  async save() {
    await this.saveButton.click()
  }

  async cancel() {
    await this.cancelButton.click()
  }
}

/**
 * Page object for interacting with the Edit view
 */
export class EditPage {
  readonly page: Page
  readonly form: Locator
  readonly saveButton: Locator
  readonly deleteButton: Locator
  readonly cancelButton: Locator

  constructor(page: Page) {
    this.page = page
    this.form = page.locator('[data-testid="shadmin-form"], form')
    this.saveButton = page.locator('button[type="submit"], button:has-text("Save")')
    this.deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-button"]')
    this.cancelButton = page.locator('a:has-text("Cancel"), button:has-text("Cancel")')
  }

  async goto(resource: string, id: string | number) {
    await this.page.goto(`/${resource}/${id}`)
    await this.page.waitForLoadState('networkidle')
  }

  async waitForForm() {
    await expect(this.form).toBeVisible({ timeout: 10000 })
  }

  async fillField(name: string, value: string) {
    const input = this.page.locator(`[name="${name}"], [data-testid="input-${name}"]`)
    await input.clear()
    await input.fill(value)
  }

  async getFieldValue(name: string) {
    const input = this.page.locator(`[name="${name}"], [data-testid="input-${name}"]`)
    return input.inputValue()
  }

  async save() {
    await this.saveButton.click()
  }

  async delete() {
    await this.deleteButton.click()
  }

  async confirmDelete() {
    const confirmButton = this.page.locator('[data-testid="shadmin-confirm-submit"], button:has-text("Confirm"), button:has-text("Delete"):visible')
    await confirmButton.click()
  }

  async cancelDelete() {
    const cancelButton = this.page.locator('[data-testid="shadmin-confirm-cancel"], button:has-text("Cancel"):visible')
    await cancelButton.click()
  }
}

/**
 * Page object for interacting with the Show view
 */
export class ShowPage {
  readonly page: Page
  readonly editButton: Locator
  readonly deleteButton: Locator
  readonly backButton: Locator

  constructor(page: Page) {
    this.page = page
    this.editButton = page.locator('a:has-text("Edit"), button:has-text("Edit")')
    this.deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-button"]')
    this.backButton = page.locator('a:has-text("Back"), button:has-text("Back")')
  }

  async goto(resource: string, id: string | number) {
    await this.page.goto(`/${resource}/${id}/show`)
    await this.page.waitForLoadState('networkidle')
  }

  async getFieldValue(label: string) {
    const field = this.page.locator(`[data-testid="field-${label}"], :has-text("${label}") + *`)
    return field.textContent()
  }

  async edit() {
    await this.editButton.click()
  }

  async delete() {
    await this.deleteButton.click()
  }
}

/**
 * Page object for interacting with the navigation/sidebar
 */
export class NavigationPage {
  readonly page: Page
  readonly sidebar: Locator
  readonly menuItems: Locator

  constructor(page: Page) {
    this.page = page
    this.sidebar = page.locator('[data-testid="shadmin-sidebar"], nav, aside')
    this.menuItems = page.locator('nav a, aside a, [role="navigation"] a')
  }

  async navigateTo(resourceLabel: string) {
    await this.page.locator(`a:has-text("${resourceLabel}")`).click()
    await this.page.waitForLoadState('networkidle')
  }

  async getMenuItemCount() {
    return this.menuItems.count()
  }

  async isMenuItemActive(resourceLabel: string) {
    const item = this.page.locator(`a:has-text("${resourceLabel}")`)
    const classes = await item.getAttribute('class')
    return classes?.includes('active') || classes?.includes('selected')
  }
}

/**
 * Extended test fixture with page objects
 */
export const test = base.extend<{
  listPage: ListPage
  createPage: CreatePage
  editPage: EditPage
  showPage: ShowPage
  navigationPage: NavigationPage
}>({
  listPage: async ({ page }, use) => {
    await use(new ListPage(page))
  },
  createPage: async ({ page }, use) => {
    await use(new CreatePage(page))
  },
  editPage: async ({ page }, use) => {
    await use(new EditPage(page))
  },
  showPage: async ({ page }, use) => {
    await use(new ShowPage(page))
  },
  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page))
  },
})

export { expect }
