describe('UI smoke tests', () => {
  beforeEach(() => cy.login());

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

  it('Navigation', () => {
    cy.ui();

    // TODO
  });

  it('Status', () => {
    cy.ui();
    cy.assertTitle('Status');

    cy.contains('Online workers');
  });

  it('Ansible repositories', () => {
    cy.ui('ansible/repositories');
    cy.assertTitle('Repositories');

    // TODO
  });

  it('Ansible remotes', () => {
    cy.ui('ansible/remotes');
    cy.assertTitle('Remotes');

    // TODO
  });

  it('File repositories', () => {
    cy.ui('file/repositories');
    cy.assertTitle('Repositories');

    // TODO
  });

  it('File remotes', () => {
    cy.ui('file/remotes');
    cy.assertTitle('Remotes');

    // TODO
  });

  it('RPMs', () => {
    cy.ui('rpm/rpms');
    cy.assertTitle('Packages');

    cy.contains('No packages yet');
  });

  it('Task management', () => {
    cy.ui('tasks');
    cy.assertTitle('Task management');

    // TODO
  });

  it('Users', () => {
    cy.ui('users');
    cy.assertTitle('Users');

    // TODO
  });

  it('Groups', () => {
    cy.ui('groups');
    cy.assertTitle('Groups');

    // TODO
  });

  it('Roles', () => {
    cy.ui('roles');
    cy.assertTitle('Roles');

    // TODO
  });

  it('About project', () => {
    cy.ui('about');
    cy.assertTitle('About project');

    // TODO
  });
});
