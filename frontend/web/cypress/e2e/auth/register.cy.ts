import { StatusCodes } from "http-status-codes";

describe("Registration flow", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	it("should allow a user to register for an account", () => {
		cy.intercept("POST", `${Cypress.env("API_URL")}/auth/register`, { accessToken: "123" }).as("register");

		cy.register("test@example.com", "password", "password");

		cy.wait("@register").then((interception) => {
			const requestBody = interception.request.body;
			expect(requestBody.email).to.equal("test@example.com");
			expect(requestBody.password).to.equal("password");
			cy.url().should("include", "/dashboard");
		});
	});

	it("should display an error message when the passwords do not match", () => {
		cy.intercept({ method: "POST", url: `${Cypress.env("API_URL")}/auth/register` }, cy.spy().as("register"));

		cy.register("test@example.com", "password", "different-password");

		cy.get("[data-cy=auth-error-message]").should("be.visible");
		cy.get("@register").should("not.have.been.called");
	});

	it("should display an error message when registration fails", () => {
		cy.intercept("POST", `${Cypress.env("API_URL")}/auth/register`, {
			statusCode: StatusCodes.BAD_REQUEST,
			body: { message: ["Registration failed", "Other error"] },
		}).as("register");

		cy.register("test@example.com", "password", "password");

		cy.wait("@register").then(() => {
			cy.get("[data-cy=auth-error-message]").should("contain", "Registration failed");
			cy.get("[data-cy=auth-error-message]").should("contain", "Other error");
		});
	});
});
