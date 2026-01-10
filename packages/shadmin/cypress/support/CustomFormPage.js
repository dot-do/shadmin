export default url => ({
    elements: {
        // shadmin uses role="status" for loading states
        appLoader: '[role="status"][aria-label="Loading"], [data-testid="loading"], .app-loader',
        body: 'body',
        // Standard form inputs with name attribute
        input: (name, type = 'input') => `${type}[name='${name}'], [data-testid="input-${name}"]`,
        // Dialog buttons use data-testid
        modalCloseButton: "[data-testid='button-close-modal'], [aria-label='Close'], button[aria-label='Close']",
        modalSubmitButton:
            "[data-testid='dialog-add-post'] button[type='submit'], [role='dialog'] button[type='submit']",
        submitAndAddButton:
            ".create-page [role='toolbar'] button[type='button'], [data-testid='create-view'] [role='toolbar'] button:last-child",
        // Reference/select inputs
        postSelect: '[data-testid="input-post_id"], [name="post_id"]',
        postItem: id => `li[data-value="${id}"], [role="option"][data-value="${id}"]`,
        // Modal triggers
        showPostCreateModalButton: '[data-value="@@ra-create"], [data-testid="create-related"]',
        showPostPreviewModalButton: '[data-testid="button-show-post"]',
        // Dialogs use role="dialog"
        postCreateModal: '[data-testid="dialog-add-post"], [role="dialog"]',
        postPreviewModal: '[data-testid="dialog-show-post"], [role="dialog"]',
    },

    navigate() {
        cy.visit(url);
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        if (clearPreviousValue) {
            cy.get(this.elements.input(name, type)).clear();
        }
        cy.get(this.elements.input(name, type)).type(value);
    },
});
