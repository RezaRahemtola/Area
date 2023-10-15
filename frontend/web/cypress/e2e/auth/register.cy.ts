import { StatusCodes } from "http-status-codes";

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
			cy.url().should("include", "/dashboard");
		});
	});

	it("should display an error message when the passwords do not match", () => {
		cy.intercept({ method: "POST", url: `${Cypress.env("API_URL")}/auth/register` }, cy.spy().as("register"));

		cy.get("[data-cy=register-open-modal]").click();
		cy.get("[data-cy=register-email-input]").type("test@example.com");
		cy.get("[data-cy=register-password-input]").type("password");
		cy.get("[data-cy=register-confirm-password-input]").type("different-password");
		cy.get("[data-cy=register-action-btn]").click();

		cy.get("[data-cy=auth-error-message]").should("be.visible");
		cy.get("@register").should("not.have.been.called");
	});

	it("should display an error message when registration fails", () => {
		cy.intercept("POST", `${Cypress.env("API_URL")}/auth/register`, {
			statusCode: StatusCodes.BAD_REQUEST,
			body: { message: ["Registration failed", "Other error"] },
		}).as("register");

		cy.get("[data-cy=register-open-modal]").click();
		cy.get("[data-cy=register-email-input]").type("test@example.com");
		cy.get("[data-cy=register-password-input]").type("password");
		cy.get("[data-cy=register-confirm-password-input]").type("password");
		cy.get("[data-cy=register-action-btn]").click();

		cy.wait("@register").then(() => {
			cy.get("[data-cy=auth-error-message]").should("contain", "Registration failed");
			cy.get("[data-cy=auth-error-message]").should("contain", "Other error");
		});
	});
});
