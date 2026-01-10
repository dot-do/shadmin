export default url => ({
    elements: {
        body: 'body',
        // shadmin uses button with specific class or data-testid
        deleteButton: '[data-testid="delete-button"], button.text-destructive, .edit-page button[aria-label="Delete"]',
        addBacklinkButton: '.button-add-backlinks, [data-testid="add-backlink-button"]',
        removeBacklinkButton: '[aria-label="Remove"], button[aria-label="Remove"]',
        input: (name, type = 'input') => {
            if (type === 'rich-text-input') {
                // Rich text editors use ProseMirror
                return `.edit-page [data-testid="input-${name}"] .ProseMirror, .edit-page .ProseMirror`;
            }
            if (type === 'checkbox-group-input') {
                // Checkbox groups use labels wrapping checkboxes
                return `.edit-page [data-testid="input-${name}"] label, [data-testid="edit-view"] [name="${name}"]`;
            }
            if (type === 'reference-array-input') {
                return `.edit-page [data-testid="input-${name}"], [data-testid="edit-view"] [name="${name}"]`;
            }
            // shadmin uses standard form elements with name attributes
            return `.edit-page [name='${name}'], [data-testid="edit-view"] [name='${name}']`;
        },
        inputs: `[data-testid="edit-content"] input, [data-testid="edit-content"] textarea, .edit-page input, .edit-page textarea`,
        // Tabs use role="tab"
        tabs: `[role="tab"]`,
        snackbar: 'div[role="alert"]',
        // shadmin uses role="toolbar" for button containers
        submitButton: ".edit-page [role='toolbar'] button[type='submit'], [data-testid='edit-view'] button[type='submit']",
        cloneButton: '.button-clone, [data-testid="clone-button"]',
        // Tabs use role="tab" with aria-controls
        tab: index => `[role="tab"]:nth-of-type(${index}), button[role="tab"]:nth-child(${index})`,
        // shadmin keeps #react-admin-title via TitlePortal component
        title: '#react-admin-title, [data-testid="edit-title"], h1',
        userMenu: '[data-testid="user-menu-trigger"], button[aria-label="Profile"]',
        logout: '.logout, [data-testid="logout-button"]',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        return cy.get(this.elements.title);
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        if (clearPreviousValue) {
            cy.get(this.elements.input(name)).clear();
        }
        cy.get(this.elements.input(name)).type(value);
        if (type === 'rich-text-input') {
            cy.wait(500);
        }
    },

    clickInput(name, type = 'input') {
        cy.get(this.elements.input(name, type)).click();
    },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click({ force: true });
    },

    submit() {
        cy.get(this.elements.submitButton).click();
    },

    delete() {
        cy.get(this.elements.deleteButton).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.body).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    clone() {
        cy.get(this.elements.cloneButton).click();
    },

    logout() {
        cy.wait(1000);
        cy.get(this.elements.userMenu).click();
        cy.get(this.elements.logout).click();
    },
});
