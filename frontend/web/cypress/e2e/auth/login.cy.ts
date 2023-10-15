import { StatusCodes } from "http-status-codes";

describe("Login flow", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	it("should allow a user to login with an account", () => {
		cy.intercept("POST", `${Cypress.env("API_URL")}/auth/login`, { accessToken: "123" }).as("login");

		cy.get("[data-cy=login-open-modal]").click();
		cy.get("[data-cy=login-email-input]").type("test@example.com");
		cy.get("[data-cy=login-password-input]").type("password");
		cy.get("[data-cy=login-action-btn]").click();

		cy.wait("@login").then((interception) => {
			const requestBody = interception.request.body;
			expect(requestBody.email).to.equal("test@example.com");
			expect(requestBody.password).to.equal("password");
			cy.url().should("include", "/dashboard");
		});
	});

	it("should display an error message when login fails", () => {
		cy.intercept("POST", `${Cypress.env("API_URL")}/auth/login`, {
			statusCode: StatusCodes.BAD_REQUEST,
			body: { message: ["Login failed", "Other error"] },
		}).as("login");

		cy.get("[data-cy=login-open-modal]").click();
		cy.get("[data-cy=login-email-input]").type("test@example.com");
		cy.get("[data-cy=login-password-input]").type("password");
		cy.get("[data-cy=login-action-btn]").click();

		cy.wait("@login").then(() => {
			cy.get("[data-cy=auth-error-message]").should("contain", "Login failed");
			cy.get("[data-cy=auth-error-message]").should("contain", "Other error");
		});
	});

	it("should display an error message when account doesn't exist", () => {
		cy.intercept("POST", `${Cypress.env("API_URL")}/auth/login`, {
			statusCode: StatusCodes.UNAUTHORIZED,
			body: { message: "Invalid email and/or password" },
		}).as("login");

		cy.get("[data-cy=login-open-modal]").click();
		cy.get("[data-cy=login-email-input]").type("test@example.com");
		cy.get("[data-cy=login-password-input]").type("password");
		cy.get("[data-cy=login-action-btn]").click();

		cy.wait("@login").then(() => {
			cy.get("[data-cy=auth-error-message]").should("exist");
		});
	});
});
