const manualLogin = (username, password) => {
  cy.ui('login');
  cy.get('#pf-login-username-id').type(username);
  cy.get('#pf-login-password-id').type(`${password}{enter}`);

  cy.assertTitle('Collections');
};

const manualLogout = () => {
  cy.get('[data-cy="user-dropdown"] button').click();
  cy.get('[aria-label="logout"]').click();
};

describe('Login helpers', () => {
  //FIXME
  const adminUsername = Cypress.env('username');
  const adminPassword = Cypress.env('password');
  const username = 'nopermission';
  const password = 'n0permissi0n';

  it('can login manually and logout as admin or different user', () => {
    manualLogin(username, password);
    cy.contains(username);
    manualLogout();
    manualLogin(adminUsername, adminPassword);
    cy.contains(adminUsername);
  });

  it('can use api login', () => {
    cy.login();
    cy.contains(adminUsername);

    cy.login(username, password);
    cy.contains(username);
  });
});
