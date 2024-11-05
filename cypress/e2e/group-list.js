describe('Group list tests for sorting, paging and filtering', () => {
  beforeEach(() => {
    cy.login();
    cy.go('group-list');
  });

  it('table contains all columns', () => {
    cy.get('tr[data-cy="SortTable-headers"] th').contains('Group');
  });

  it('paging', () => {
    cy.get('.pulp-section').get('[aria-label="Go to next page"]:first').click();
  });

  it('sorting', () => {
    cy.get('.pulp-section').get('[data-cy="sort_name"]').click();
  });

  it('filter', () => {
    cy.get('.pulp-section')
      .get('[placeholder="Filter by group name"]:first')
      .type('group_test0{enter}');
    cy.get('.pulp-section').contains('group_test0');
    cy.get('.pulp-section').contains('group_test1').should('not.exist');
  });

  it('set page size', () => {
    cy.get('.pulp-section')
      .get('[data-ouia-component-type="PF5/Pagination"] button:first')
      .click();
    cy.get('.pulp-section').contains('20 per page').click();
  });
});
