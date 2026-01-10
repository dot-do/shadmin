export default url => ({
    elements: {
        addAuthor: '.button-add-authors, [data-testid="add-author-button"]',
        body: 'body',
        input: (name, type = 'input') => {
            if (type === 'rich-text-input') {
                // Rich text editors use ProseMirror
                return `.create-page [data-testid="input-${name}"] .ProseMirror, .create-page .ProseMirror`;
            }
            // shadmin uses standard form elements with name attributes
            return `.create-page ${type}[name='${name}'], [data-testid="create-view"] ${type}[name='${name}']`;
        },
        inputs: `[data-testid="create-content"] input, [data-testid="create-content"] textarea, .create-page input, .create-page textarea`,
        richTextInputError: '.create-page [data-testid="rich-text-error"], [data-testid="create-content"] .text-destructive',
        snackbar: 'div[role="alert"]',
        // shadmin uses role="toolbar" for button containers
        submitButton: ".create-page [role='toolbar'] button[type='submit'], [data-testid='create-view'] button[type='submit']",
        submitAndShowButton:
            ".create-page [role='toolbar'] button[type='button']:nth-child(2), [data-testid='create-view'] [role='toolbar'] button:nth-child(2)",
        submitAndAddButton:
            ".create-page [role='toolbar'] button[type='button']:nth-child(3), [data-testid='create-view'] [role='toolbar'] button:nth-child(3)",
        submitCommentable:
            ".create-page [role='toolbar'] button[type='button']:last-child, [data-testid='create-view'] [role='toolbar'] button:last-child",
        descInput: '.ProseMirror',
        // Tabs use role="tab" with aria-controls
        tab: index => `[role="tab"]:nth-of-type(${index}), button[role="tab"]:nth-child(${index})`,
        // shadmin keeps #react-admin-title via TitlePortal component
        title: '#react-admin-title, [data-testid="create-title"], h1',
        userMenu: '[data-testid="user-menu-trigger"], button[aria-label="Profile"]',
        logout: '.logout, [data-testid="logout-button"]',
        // Error messages use text-destructive class in shadmin
        nameError: '.text-destructive, [data-testid="error-message"], p.text-sm.text-destructive',
    },

    navigate() {
        cy.visit(url);
    },

    waitUntilVisible() {
        cy.get(this.elements.submitButton).should('be.visible');
    },

    setInputValue(type, name, value, clearPreviousValue = true) {
        if (type === 'checkbox') {
            if (value === true) {
                return cy.get(this.elements.input(name, 'input')).check();
            }
            return cy.get(this.elements.input(name, 'input')).check();
        }
        if (clearPreviousValue) {
            cy.get(this.elements.input(name, type)).clear();
        }
        cy.get(this.elements.input(name, type)).type(
            `${clearPreviousValue ? '{selectall}' : ''}${value}`
        );
        if (type === 'rich-text-input') {
            cy.wait(500);
        }
    },

    setValues(values, clearPreviousValue = true) {
        values.forEach(val => {
            this.setInputValue(
                val.type,
                val.name,
                val.value,
                clearPreviousValue
            );
        });
    },

    submit(expectNotification = true) {
        cy.get(this.elements.submitButton).click();
        if (expectNotification) {
            cy.get(this.elements.snackbar);
            cy.get(this.elements.body).click(); // dismiss notification
            cy.wait(200); // let the notification disappear (could block further submits)
        }
    },

    submitWithKeyboard() {
        cy.get("input[type='text']:first").type('{enter}');
        cy.get(this.elements.snackbar);
        cy.get(this.elements.snackbar).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    submitAndShow() {
        cy.get(this.elements.submitAndShowButton).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.snackbar).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    submitAndAdd() {
        cy.get(this.elements.submitAndAddButton).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.snackbar).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    submitWithAverageNote() {
        cy.get(this.elements.submitCommentable).click();
        cy.get(this.elements.snackbar);
        cy.get(this.elements.snackbar).click(); // dismiss notification
        cy.wait(200); // let the notification disappear (could block further submits)
    },

    gotoTab(index) {
        cy.get(this.elements.tab(index)).click({ force: true });
    },

    logout() {
        cy.wait(1000);
        cy.get(this.elements.userMenu).click();
        cy.get(this.elements.logout).click();
    },
});
