export default url => ({
    elements: {
        // shadmin uses data-testid for login elements and role="status" for loading
        appLoader: '[role="status"][aria-label="Loading"], [data-testid="loading"]',
        // shadmin uses standard input elements with name attributes
        username: "input[name='username'], [data-testid='login-username']",
        password: "input[name='password'], [data-testid='login-password']",
        submitButton: "button[type='submit'], [data-testid='login-submit']",
        // shadmin keeps #react-admin-title via TitlePortal for compatibility
        title: '#react-admin-title, [data-testid="login-title"], h1',
        // Login form container
        loginForm: '[data-testid="login-form"], form',
        // Error message
        loginError: '[data-testid="login-error"], div[role="alert"]',
    },

    navigate() {
        cy.visit(url);
        this.waitUntilVisible();
    },

    waitUntilVisible() {
        cy.get(this.elements.username);
    },

    login(username = 'login', password = 'password', shouldFail = false) {
        cy.get(this.elements.username).clear().type(username);
        cy.get(this.elements.password).clear().type(password);
        cy.get(this.elements.submitButton).click();
        if (!shouldFail) {
            // Wait for title to appear indicating successful login
            cy.get(this.elements.title);
        }
    },
});
