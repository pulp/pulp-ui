describe('RBAC table contains correct headers and filter', () => {
  before(() => {
    cy.login();
    cy.go(`roles`);
  });

  it('table contains all columns and filter', () => {
    cy.login();
    cy.go(`roles`);
    cy.contains('Roles');

    // ensure proper headers
    [('Role name', 'Description', 'Created', 'Editable')].forEach((item) => {
      cy.get('tr[data-cy="SortTable-headers"] th').contains(item);
    });
  });
});
