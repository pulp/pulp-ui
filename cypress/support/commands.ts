declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			assertTitle(title: string): Chainable<JQuery<HTMLElement>>;
			ui(path?: string): Chainable<AUTWindow>;
			login(username?: string, password?: string): Chainable<null>;
		}
	}
}

const ui = Cypress.expose("uiBasePath");

Cypress.Commands.add("assertTitle", (title) => {
	return cy.contains(".pf-v5-c-title", title);
});

Cypress.Commands.add("ui", (path = "") => {
	return cy.visit(ui + path);
});

Cypress.Commands.add("login", (username, password) => {
	if (!username || !password) {
		return cy.env(["username", "password"]).then(({ username, password }) => {
			return cy.session(username, () => {
				window.sessionStorage.credentials = JSON.stringify({
					username,
					password,
				});
			});
		});
	}

	return cy.session(username, () => {
		window.sessionStorage.credentials = JSON.stringify({
			username,
			password,
		});
	});
});

export {};
