describe('UI smoke tests', () => {
  beforeEach(() => cy.login());

  // Seperate out into own test
  it('Logout + login', () => {
    cy.ui();

    // log out via top nav
    cy.get('[data-cy=user-dropdown]').click();
    cy.contains('a', 'Logout').click();

    // go to login via left nav
    cy.get('[data-cy=pulp-menu-item-Login]').click();
    cy.assertTitle('Login');

    // fill in form manually, submit
    cy.get('#pf-login-username-id').type(Cypress.env('username'));
    cy.get('#pf-login-password-id').type(Cypress.env('password'));
    cy.contains('button', 'Log in').click();

    // check on Status, logged in
    cy.assertTitle('Status');
    cy.get('[data-cy=user-dropdown]');
  });

  // Get rid
  it('Navigation', () => {
    cy.ui();

    // TODO
  });

  // Unauthenticated
  it('Status', () => {
    cy.ui();
    cy.assertTitle('Status');

    cy.contains('Online workers');
  });

  // authenticated
  it('Ansible repositories', () => {
    cy.ui('ansible/repositories');
    cy.assertTitle('Repositories');

    // TODO
  });

  // authenticated
  it('Ansible remotes', () => {
    cy.ui('ansible/remotes');
    cy.assertTitle('Remotes');

    // TODO
  });

  // authenticated
  it('File repositories', () => {
    cy.ui('file/repositories');
    cy.assertTitle('Repositories');

    // TODO
  });

  // authenticated
  it('File remotes', () => {
    cy.ui('file/remotes');
    cy.assertTitle('Remotes');

    // TODO
  });

  // authenticated
  it('RPMs', () => {
    cy.ui('rpm/rpms');
    cy.assertTitle('Packages');

    cy.contains('No packages yet');
  });

  // authenticated
  it('Task management', () => {
    cy.ui('tasks');
    cy.assertTitle('Task management');

    // TODO
  });

  // authenticated
  it('Users', () => {
    cy.ui('users');
    cy.assertTitle('Users');

    // TODO
  });

  // authenticated
  it('Groups', () => {
    cy.ui('groups');
    cy.assertTitle('Groups');

    // TODO
  });

  // authenticated
  it('Roles', () => {
    cy.ui('roles');
    cy.assertTitle('Roles');

    // TODO
  });

  // unauthenticated
  it('About project', () => {
    cy.ui('about');
    cy.assertTitle('About project');

    // TODO
  });
});
