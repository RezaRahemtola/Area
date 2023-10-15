Cypress.Commands.add("register", (email: string, password: string, confirmPassword: string) => {
	cy.get("[data-cy=register-open-modal]").click({ force: true });
	cy.get("[data-cy=register-email-input]").type(email, { force: true });
	cy.get("[data-cy=register-password-input]").type(password, { force: true });
	cy.get("[data-cy=register-confirm-password-input]").type(confirmPassword, { force: true });
	cy.get("[data-cy=register-action-btn]").click({ force: true });
});

Cypress.Commands.add("login", (email: string, password: string) => {
	cy.get("[data-cy=login-open-modal]").click({ force: true });
	cy.get("[data-cy=login-email-input]").type(email, { force: true });
	cy.get("[data-cy=login-password-input]").type(password, { force: true });
	cy.get("[data-cy=login-action-btn]").click({ force: true });
});
