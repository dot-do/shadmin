export default (url, initialField = 'title') => ({
    elements: {
        body: 'body',
        // shadmin uses data-testid for fields and spans for field values
        field: name => `[data-testid="field-${name}"], [data-source="${name}"] span, .show-page [data-source="${name}"]`,
        fields: `[data-testid="show-content"] > *, .show-page [data-source]`,
        snackbar: 'div[role="alert"], div[role="alertdialog"]',
        // Tabs use role="tab"
        tabs: `[role="tab"]`,
        tab: index => `[role="tab"]:nth-of-type(${index}), button[role="tab"]:nth-child(${index})`,
        userMenu: '[data-testid="user-menu-trigger"], button[aria-label="Profile"]',
        logout: '.logout, [data-testid="logout-button"]',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        cy.get(this.elements.field(initialField)).should('be.visible');
    },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click();
    },

    logout() {
        cy.wait(1000);
        cy.get(this.elements.userMenu).click();
        cy.get(this.elements.logout).click();
    },
});
