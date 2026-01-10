export default url => ({
    elements: {
        // Filter elements - shadmin uses .filter-button and .filter-form
        addFilterButton: '.filter-button',
        appLoader: '[role="status"][aria-label="Loading"]',
        displayedRecords: '.flex-1.text-sm.text-muted-foreground',
        filter: name => `.filter-form input[name='${name}'], .filter-form input`,
        filterButton: name => `.filter-form [data-source='${name}'], .filter-form`,
        filterMenuItems: `.filter-form`,
        menuItems: `[role=menuitem]`,
        filterMenuItem: source => `[data-key="${source}"], .filter-form`,
        hideFilterButton: source =>
            `[data-source="${source}"] button, .filter-form button[type="reset"]`,
        // Pagination - shadmin uses aria-labels
        nextPage: "button[aria-label='Go to next page']",
        previousPage: "button[aria-label='Go to previous page']",
        pageNumber: n => `button[aria-label='Go to page ${n}']`,
        // Datagrid - shadmin uses standard table elements
        recordRows: 'tbody tr[data-selected], tbody tr:not(:has(td[colspan]))',
        viewsColumn: 'tbody tr td:nth-child(8)',
        datagridHeaders: 'th',
        sortBy: name => `th[data-testid="column-header-${name}"], th[aria-sort]`,
        svg: (name, criteria = '') =>
            `th[data-testid="column-header-${name}"] svg${criteria}`,
        // User menu - shadmin uses data-testid and aria-label
        profile: '[data-testid="user-menu-trigger"], button[aria-label="Profile"]',
        logout: '.logout, [data-testid="logout-button"]',
        // Bulk actions - shadmin uses role="toolbar"
        bulkActionsToolbar: '[role="toolbar"], [data-testid="bulk-actions-toolbar"]',
        customBulkActionsButton:
            '[role="toolbar"] button[aria-label="Reset views"], [data-testid="bulk-actions-toolbar"] button',
        deleteBulkActionsButton:
            '[role="toolbar"] button[aria-label="Delete"], [data-testid="bulk-actions-toolbar"] button',
        // Selection - shadmin uses standard checkboxes
        selectAll: 'thead input[type="checkbox"][aria-label="Select all rows"]',
        selectedItem: 'tbody input[type="checkbox"]:checked',
        selectItem: 'tbody input[type="checkbox"]',
        userMenu: '[data-testid="user-menu-trigger"], button[aria-label="Profile"]',
        // Title - shadmin keeps #react-admin-title for compatibility
        title: '#react-admin-title, [data-testid="list-title"], h1',
        headroomUnfixed: '.headroom--unfixed, [data-testid="appbar"]',
        headroomUnpinned: '.headroom--unpinned, [data-testid="appbar"]',
        skipNavButton: '.skip-nav-button, [data-testid="skip-nav"]',
        mainContent: '#main-content, [data-testid="main-content"], main',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        return cy.get(this.elements.title);
    },

    waitUntilDataLoaded() {
        return cy.get(this.elements.appLoader);
    },

    openFilters() {
        cy.get(this.elements.addFilterButton).click();
    },

    nextPage() {
        cy.get(this.elements.nextPage).click();
    },

    previousPage() {
        cy.get(this.elements.previousPage).click();
    },

    goToPage(n) {
        return cy.get(this.elements.pageNumber(n)).click();
    },

    addCommentableFilter() {
        this.openFilters();
        cy.get(this.elements.filterMenuItem('commentable')).click();
    },

    commentableFilter() {
        return cy.get(this.elements.filterButton('commentable'));
    },

    setFilterValue(name, value, clearPreviousValue = true) {
        cy.get(this.elements.filter(name));
        if (clearPreviousValue) {
            cy.get(this.elements.filter(name)).clear();
        }
        if (value) {
            cy.get(this.elements.filter(name)).type(value);
        }
    },

    showFilter(name) {
        cy.get(this.elements.addFilterButton).click();

        cy.get(this.elements.filterMenuItem(name)).click();
    },

    hideFilter(name) {
        cy.get(this.elements.hideFilterButton(name)).click();
    },

    logout() {
        cy.wait(1000);
        cy.get(this.elements.userMenu).click();
        cy.get(this.elements.logout).click();
    },

    setAsNonLogged() {
        cy.window().then(win => {
            win.localStorage.setItem('not_authenticated', true);
        });
    },

    toggleSelectAll() {
        cy.get(this.elements.selectAll).click();
    },

    toggleSelectSomeItems(count) {
        cy.get(this.elements.selectItem).then(els => {
            for (let i = 0; i < count; i++) {
                els[i].click();
            }
        });
    },

    applyUpdateBulkAction() {
        cy.get(this.elements.customBulkActionsButton).click();
    },

    applyDeleteBulkAction() {
        cy.get(this.elements.deleteBulkActionsButton).click();
    },

    toggleColumnSort(name) {
        cy.get(this.elements.sortBy(name)).click().blur();
    },
});
