import "@cypress/code-coverage/support";
// eslint-disable-next-line import/extensions
import "./commands";

declare global {
	namespace Cypress {
		interface Chainable {
			register(email: string, password: string, confirmPassword: string): Chainable<JQuery<HTMLElement>>;

			login(email: string, password: string): Chainable<JQuery<HTMLElement>>;
		}
	}
}
