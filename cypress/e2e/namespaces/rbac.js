const uiPrefix = Cypress.env('uiPrefix');

const username = 'testUser';
const userPassword = 'I am a complicated passw0rd';

describe('RBAC test for user without permissions', () => {
  beforeEach(() => {
    cy.login(username, userPassword);
  });

  it("shouldn't display create, edit and delete buttons in namespace when user doesn't have permission", () => {
    cy.visit(`${uiPrefix}namespaces`);

    // cannot Add namespace
    cy.contains('Create').should('not.exist');

    cy.visit(`${uiPrefix}namespaces/testspace`);

    // cannot Change namespace and Delete namespace
    cy.get('[data-cy=kebab-toggle]').should('not.exist');

    // cannot Upload to namespace
    cy.contains('Upload collection').should('not.exist');
  });

  it("shouldn't let delete collection and modify ansible repo content when user doesn't have permission", () => {
    cy.visit(`${uiPrefix}repo/published/testspace/testcollection`);

    // cannot Delete collection
    cy.get('[data-cy="kebab-toggle"]').should('not.exist');
  });

  it("shouldn't let view, add, change and delete users when user doesn't have permission", () => {
    // cannot View user
    cy.menuMissing('User Access > Users');
    cy.visit(`${uiPrefix}users`);
    cy.contains('You do not have access to Pulp UI');

    // cannot Add user
    cy.contains('Create').should('not.exist');
    cy.visit(`${uiPrefix}users/create`);
    cy.contains('You do not have access to Pulp UI');

    // cannot Change and Delete user
    cy.visit(`${uiPrefix}users`);
    cy.get('[data-cy="UserList-row-testUser"] [data-cy=kebab-toggle]').should(
      'not.exist',
    );
  });

  it("shouldn't let view, add, change and delete groups when user doesn't have permission", () => {
    // cannot View group
    cy.menuMissing('User Access > Groups');
    cy.visit(`${uiPrefix}group-list`);
    cy.contains('You do not have access to Pulp UI');

    // cannot Add group
    cy.contains('Create').should('not.exist');

    // cannot Change and Delete group
    cy.get('[data-cy="GroupList-row-testgroup"]').should('not.exist');
  });

  it("shouldn't let create, edit or delete container when user doesn't have permission", () => {
    cy.visit(`${uiPrefix}containers`);

    // cannot Create new containers
    cy.contains('Add container').should('not.exist');

    // cannot Change and Delete container
    cy.get(
      '[data-cy="ExecutionEnvironmentList-row-testcontainer"] [data-cy="kebab-toggle"]',
    ).click();
    cy.contains('Edit').should('not.exist');
    cy.contains('Delete').should('not.exist');

    cy.visit(`${uiPrefix}containers/testcontainer`);
    cy.contains('Edit').should('not.exist');
    cy.get('[aria-label="Actions"]').click();
    cy.contains('Delete').should('not.exist');

    // temporary solution (button should not be visible, if user has no permissions to sync it)
    cy.contains('Sync from registry').should('not.exist');
  });

  it("shouldn't let add, delete and sync remote registries when user doesn't have permission", () => {
    // can Add remote registry
    // in here we hide the button (correct), but in containers we dont (wrong)
    cy.visit(`${uiPrefix}registries`);
    cy.contains('Add remote registry').should('not.exist');

    // can Change and Delete remote registry
    cy.get(
      '[data-cy="ExecutionEnvironmentRegistryList-row-docker"] [data-cy="kebab-toggle"]',
    ).click();
    cy.contains('Edit').should('not.exist');
    cy.contains('Delete').should('not.exist');

    // cannot sync remote registry
    cy.contains('Sync from registry').should('not.exist');
  });

  it("should let view task when user doesn't have permission", () => {
    cy.visit(`${uiPrefix}tasks`);
    cy.get('[aria-label="Task list"] tr td a').first().click();
    cy.contains('Task detail');
  });
});

describe('RBAC test for user with permissions', () => {
  before(() => {
    cy.login();

    cy.addRemoteContainer({
      name: `testcontainer`,
      upstream_name: 'library/alpine',
      registry: `docker`,
      include_tags: 'latest',
    });
  });

  it('should display create, edit and delete buttons in namespace when user has permissions', () => {
    cy.login(username, userPassword);

    cy.visit(`${uiPrefix}namespaces`);

    // can Add namespace
    cy.contains('Create').should('exist');
    cy.visit(`${uiPrefix}namespaces/testspace2`);
    cy.get('[data-cy="ns-kebab-toggle"]').should('exist').click();
    cy.contains('Edit namespace');
    cy.contains('Delete namespace');

    // can Upload to namespace
    cy.contains('Upload collection').should('exist');
  });

  it('should let delete collection and modify ansible repo content when user has permissions', () => {
    cy.login(username, userPassword);

    cy.visit(`${uiPrefix}repo/published/testspace2/testcollection2`);
    cy.contains('Go to documentation');

    // can Delete collection
    cy.openHeaderKebab();
    cy.contains('Delete collection from system');
  });

  it('should let view, add, change and delete users when user has permissions', () => {
    cy.login(username, userPassword);

    // can View user
    cy.menuPresent('User Access > Users');
    cy.visit(`${uiPrefix}users`);
    cy.contains('Users');

    // can Add user
    cy.contains('Create');
    cy.visit(`${uiPrefix}users/create`);
    cy.contains('Create new user');

    // can Change and Delete user
    cy.visit(`${uiPrefix}users`);
    cy.get(
      '[data-cy="UserList-row-testUser"] [data-cy=kebab-toggle] > .pf-v5-c-dropdown',
    ).click();
    cy.contains('Edit').should('exist');
    cy.contains('Delete').should('exist');
  });

  it('should let view, add, change and delete groups when user has permissions', () => {
    cy.login(username, userPassword);

    // can View group
    cy.menuPresent('User Access > Groups');
    cy.visit(`${uiPrefix}group-list`);
    cy.contains('Groups');

    // can Add group
    cy.contains('Create').should('exist');

    // can Change and Delete group
    cy.get(
      '[data-cy="GroupList-row-testgroup"] [data-cy=kebab-toggle] > .pf-v5-c-dropdown',
    ).click();
    cy.contains('Delete').should('exist');
  });

  it('should let create, edit or delete container when user has permission', () => {
    cy.login(username, userPassword);

    cy.visit(`${uiPrefix}containers`);

    // can Create new containers
    cy.contains('Add container').should('exist');

    // can Change and Delete container
    cy.get(
      '[data-cy="ExecutionEnvironmentList-row-testcontainer"] [data-cy="kebab-toggle"]',
    ).click();
    cy.contains('Edit').should('exist');
    cy.contains('Delete').should('exist');

    cy.visit(`${uiPrefix}containers/testcontainer`);
    cy.contains('Edit').should('exist');
    cy.get('[aria-label="Actions"]').click();
    cy.contains('Delete').should('exist');
    cy.contains('Sync from registry').click();
    cy.get('[data-cy="AlertList"] .pf-v5-c-alert__title').contains(
      'Sync started for remote registry "testcontainer".',
    );
  });

  it('should let add, delete and sync remote registries when user has permission', () => {
    cy.login(username, userPassword);

    // can Add remote registry
    cy.visit(`${uiPrefix}registries`);
    cy.contains('Add remote registry').should('exist');

    // can Change and Delete remote registry
    cy.get('[data-cy="kebab-toggle"]').click();
    cy.contains('Edit');
    cy.contains('Delete');

    // can sync remote registry
    cy.contains('Sync from registry').click();
    cy.get('[data-cy="AlertList"] .pf-v5-c-alert__title').contains(
      'Sync started for remote registry "docker".',
    );
  });

  it('should let view task when user has permission', () => {
    cy.login(username, userPassword);

    cy.visit(`${uiPrefix}tasks`);
    cy.get('[aria-label="Task list"] tr td a').first().click();
    cy.contains('Task detail');
  });
});
