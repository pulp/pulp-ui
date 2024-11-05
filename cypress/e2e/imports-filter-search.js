describe('Imports filter test', () => {
  beforeEach(() => {
    cy.login();
    cy.go(`my-imports?namespace=filter_test_namespace`);
  });

  it('partial filter for name', () => {
    cy.get('input[aria-label="keywords"').type('my_collection{enter}');

    cy.get('[data-cy="import-list-data"]')
      .contains('different_name')
      .should('not.exist');
    cy.get('[data-cy="import-list-data"]').contains('my_collection1');
    cy.get('[data-cy="import-list-data"]').contains('my_collection2');
  });

  it('exact filter for name', () => {
    cy.get('input[aria-label="keywords"').type('my_collection1{enter}');

    cy.get('[data-cy="import-list-data"]')
      .contains('my_collection2')
      .should('not.exist');
    cy.get('[data-cy="import-list-data"]')
      .contains('different_name')
      .should('not.exist');
    cy.get('[data-cy="import-list-data"]').contains('my_collection1');
  });

  it('Exact search for completed', () => {
    cy.get('[data-cy="compound_filter"] button:first').click();
    cy.contains('[data-cy="compound_filter"] a', 'Status').click();

    cy.get('[data-cy="compound_filter"] button').eq(1).click();

    // waiting to another query, otherwise sporadic failuers

    cy.contains('[data-cy="compound_filter"] a', 'Completed').click();

    cy.get('[data-cy="import-list-data"]').contains('my_collection1');
    cy.get('[data-cy="import-list-data"]').contains('my_collection2');
    cy.get('[data-cy="import-list-data"]').contains('different_name');
  });

  it('Exact search for waiting', () => {
    cy.get('[data-cy="compound_filter"] button:first').click();
    cy.contains('[data-cy="compound_filter"] a', 'Status').click();

    cy.get('[data-cy="compound_filter"] button').eq(1).click();
    cy.contains('[data-cy="compound_filter"] a', 'Waiting').click();
    cy.contains('No results found');
  });

  it('Exact search for name and completed', () => {
    cy.get('[data-cy="compound_filter"] input[aria-label="keywords"').type(
      'my_collection1{enter}',
    );
    cy.get('[data-cy="compound_filter"] button:first').click();
    cy.contains('[data-cy="compound_filter"] a', 'Status').click();

    cy.get('[data-cy="compound_filter"] button').eq(1).click();

    // waiting to another query, otherwise sporadic failuers

    cy.contains('a', 'Completed').click();

    cy.get('[data-cy="import-list-data"]')
      .contains('different_name')
      .should('not.exist');
    cy.get('[data-cy="import-list-data"]').contains('my_collection1');
  });

  it('Partial search for name and completed', () => {
    cy.get('[data-cy="compound_filter"] input[aria-label="keywords"').type(
      'my_collection{enter}',
    );
    cy.get('[data-cy="compound_filter"] button:first').click();
    cy.contains('[data-cy="compound_filter"] a', 'Status').click();

    cy.get('[data-cy="compound_filter"] button').eq(1).click();

    // waiting to another query, otherwise sporadic failuers

    cy.contains('a', 'Completed').click();

    cy.get('[data-cy="import-list-data"]').contains('my_collection2');
    cy.get('[data-cy="import-list-data"]')
      .contains('different_name')
      .should('not.exist');
  });
});
