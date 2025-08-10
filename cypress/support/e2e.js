// https://on.cypress.io/custom-commands

// const api = Cypress.env('API_BASE_PATH');
const ui = Cypress.env('UI_BASE_PATH');

Cypress.Commands.add('assertTitle', {}, (title) => {
  cy.contains('.pf-v5-c-title', title);
});

Cypress.Commands.add('assertListText', {}, (text) => {
  cy.contains('.pf-v5-c-description-list__text', text);
});

Cypress.Commands.add('ui', {}, (path = '') => {
  cy.visit(ui + path);
});

Cypress.Commands.add('login', {}, (username, password) => {
  if (!username && !password) {
    // default to admin
    username = Cypress.env('username');
    password = Cypress.env('password');
  }

  cy.session(username, () => {
    window.sessionStorage.credentials = JSON.stringify({
      username,
      password,
    });
  });
});
