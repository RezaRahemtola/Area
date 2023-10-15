describe("Registration flow", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	it("should allow a user to register for an account", () => {
		cy.intercept("POST", `${Cypress.env("API_URL")}/auth/register`, { accessToken: "123" }).as("register");

		cy.get("[data-cy=register-open-modal]").click();
		cy.get("[data-cy=register-email-input]").type("test@example.com");
		cy.get("[data-cy=register-password-input]").type("password");
		cy.get("[data-cy=register-confirm-password-input]").type("password");
		cy.get("[data-cy=register-action-btn]").click();

		cy.wait("@register").then((interception) => {
			const requestBody = interception.request.body;
			expect(requestBody.email).to.equal("test@example.com");
			expect(requestBody.password).to.equal("password");
		});
	});
});
