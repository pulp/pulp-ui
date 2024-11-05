describe('User list tests for sorting, paging and filtering', () => {
  beforeEach(() => {
    cy.login();
    cy.ui('users');
  });

  it('table contains all columns', () => {
    [
      'Username',
      'First name',
      'Last name',
      'Email',
      'Groups',
      'Created',
    ].forEach((item) => {
      cy.get('tr[data-cy="SortTable-headers"] th').contains(item);
    });
  });

  it('table contains some time informations for new users', () => {
    cy.contains('a few seconds ago');
  });

  it('paging', () => {
    cy.get('.pulp-section').get('[aria-label="Go to next page"]:first').click();
    cy.get('.pulp-section').get('[aria-label="Go to next page"]:first').click();
  });

  it('sorting', () => {
    cy.get('.pulp-section').get('[data-cy="sort_username"]').click();
  });

  it('filter', () => {
    cy.get('.pulp-section')
      .get('[aria-label="username__contains"]:first')
      .type('user_test0{enter}');
    cy.get('.pulp-section').contains('user_test0');
    cy.get('.pulp-section').contains('user_test1').should('not.exist');
  });

  it('set page size', () => {
    cy.get('.pulp-section')
      .get('[data-ouia-component-type="PF5/Pagination"] button:first')
      .click();
    cy.get('.pulp-section').contains('20 per page').click();
  });
});
