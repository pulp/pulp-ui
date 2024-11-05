describe('Collections list Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.go(`collections`);
    cy.contains('Collections');
  });

  it('paging', () => {
    // there should be 11 items in db, 10 per page + 1 view more
    cy.get('.collection-container')
      .get('.pulp-c-card-collection-container')
      .should('have.length', 11);

    cy.get('.pulp-cards').get('[aria-label="Go to next page"]:first').click();
    cy.get('.collection-container')
      .get('.pulp-c-card-collection-container')
      .should('have.length', 1);
  });

  it('filter', () => {
    cy.get('.pulp-cards')
      .get('[aria-label="keywords"]:first')
      .type('my_collection0{enter}');
    cy.get('.pulp-cards').contains('my_collection0');
    cy.get('.pulp-cards').contains('my_collection1').should('not.exist');
  });

  it('set page size', () => {
    cy.get('.pulp-cards')
      .get('[data-ouia-component-type="PF5/Pagination"] button:first')
      .click();
    cy.get('.pulp-cards').get('[data-action="per-page-20"]').click();

    cy.get('.collection-container')
      .get('.pulp-c-card-collection-container')
      .should('have.length', 11);
  });

  it('Cards/List switch', () => {
    cy.get('[data-cy="view_type_list"] svg').click();

    cy.get('[data-cy="CollectionListItem"]').should('have.length', 10);
  });

  it('Can delete collection in collection list', () => {
    cy.get('[data-cy="view_type_list"] svg').click();
    cy.get('[data-cy=pulp-list-toolbar]')
      .get('[aria-label="keywords"]:first')
      .type('my_collection0{enter}');
    cy.get('.pulp-list').contains('my_collection2').should('not.exist');
    cy.get('.pulp-list').contains('my_collection0');

    cy.get('.collection-container [aria-label="Actions"]').click();
    cy.contains('Delete collection from system').click();
    cy.get('[data-cy=modal_checkbox] input').click();
    cy.get('[data-cy=delete-button] button').click();
    cy.contains('Collection "my_collection0" has been successfully deleted.', {
      timeout: 15000,
    });
    cy.contains('No results found');
  });

  it('Can delete collection in namespace collection list', () => {
    cy.go(`namespaces/my_namespace`);
    cy.get('[data-cy=pulp-list-toolbar]')
      .get('[aria-label="keywords"]:first')
      .type('my_collection1{enter}');

    cy.get('.pulp-section').contains('my_collection1');
    cy.get('.pulp-section [aria-label="Actions"]').click();
    cy.contains('Delete collection from system').click();
    cy.get('[data-cy=modal_checkbox] input').click();
    cy.get('[data-cy=delete-button] button').click();

    cy.contains('Collection "my_collection1" has been successfully deleted.', {
      timeout: 15000,
    });
    cy.contains('No results found');
  });
});
