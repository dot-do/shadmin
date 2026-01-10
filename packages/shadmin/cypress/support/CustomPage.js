export default url => ({
    elements: {
        // shadmin uses role="status" for loading states
        appLoader: '[role="status"][aria-label="Loading"], [data-testid="loading"], .app-loader',
        // Custom page elements - keep generic selectors with fallbacks
        total: '.total, [data-testid="total"]',
        // shadmin layouts use data-slot or specific classes
        layout: '[data-slot="layout"], [data-testid="layout"], .layout, main',
    },

    navigate() {
        cy.visit(url);
    },

    getTotal() {
        return cy.get(this.elements.total);
    },
});
