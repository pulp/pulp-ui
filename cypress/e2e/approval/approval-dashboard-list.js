import { range } from 'lodash';

const apiPrefix = Cypress.env('apiPrefix');
const uiPrefix = Cypress.env('uiPrefix');

describe('Approval Dashboard list tests for sorting, paging and filtering', () => {
  const items = [];

  function loadData() {
    const intercept_url = `${apiPrefix}v3/plugin/ansible/search/collection-versions/?order_by=-pulp_created&offset=0&limit=100`;

    cy.visit(`${uiPrefix}approval?page_size=100`);
    cy.intercept('GET', intercept_url).as('data');
    cy.contains('button', 'Clear all filters').click();

    cy.wait('@data').then(({ response: { body } }) => {
      body.data.forEach((record) => {
        items.push(record.collection_version.name);
      });
      items.sort();
    });
  }

  before(() => {
    cy.login();
    loadData();
  });

  beforeEach(() => {
    cy.login();
    cy.visit(`${uiPrefix}approval`);
    cy.contains('button', 'Clear all filters').click();
  });

  it('should contains all columns', () => {
    ['Namespace', 'Collection', 'Version', 'Date created', 'Status'].forEach(
      (item) => {
        cy.get('[data-cy="SortTable-headers"]').contains(item);
      },
    );
  });

  it('should sort & page', () => {
    cy.get('[data-cy="sort_name"]').click();
    cy.get('[data-cy="sort_name"]').click();

    cy.get('[data-cy="body"]').contains(items[0]);

    cy.get('[data-cy="body"]')
      .get('[aria-label="Go to next page"]:first')
      .click();
    cy.get('[data-cy="body"]').contains(items[10]);
  });

  it('should sort collection', () => {
    cy.get('[data-cy="sort_name"]').click();
    cy.get('[data-cy="body"]').contains('approval');

    cy.get('[data-cy^="ApprovalRow"]:first').contains(items.at(-1));
    cy.get('[data-cy^="ApprovalRow"]').contains(items.at(-2));
    cy.get('[data-cy^="ApprovalRow"]').contains(items.at(-3));
  });

  it('should see time informations', () => {
    cy.contains('[data-cy="body"]', 'a few seconds ago');
  });

  it('should filter collection', () => {
    cy.get('[data-cy="body"] [data-cy="compound_filter"] button:first').click();
    cy.contains(
      '[data-cy="body"] [data-cy="compound_filter"] a',
      'Collection name',
    ).click();
    cy.get('[data-cy="sort_name"]').click();
    cy.get('[data-cy="sort_name"]').click();

    cy.get('[data-cy="body"] [data-cy="compound_filter"] input').type(
      'approval_collection_test0{enter}',
    );
    cy.get('[data-cy="body"]').contains('approval_collection_test0');
    cy.get('[data-cy="body"]')
      .contains('approval_collection_test1')
      .should('not.exist');
  });

  it('should filter collection and namespace together', () => {
    cy.get('[data-cy="body"] [data-cy="compound_filter"] button:first').click();
    cy.contains(
      '[data-cy="body"] [data-cy="compound_filter"] a',
      'Collection name',
    ).click();
    cy.get('[data-cy="body"] .pulp-toolbar input').type(
      'approval_collection_test0{enter}',
    );

    cy.get('[data-cy="body"] .pulp-toolbar button:first').click();
    cy.contains(
      '[data-cy="body"] [data-cy="compound_filter"] a',
      'Namespace',
    ).click();
    cy.get('[data-cy="body"] [data-cy="compound_filter"] input').type(
      'approval_namespace_test{enter}',
    );

    cy.get('[data-cy="sort_name"]').click();
    cy.get('[data-cy="sort_name"]').click();

    cy.get('[data-cy="body"]').contains('approval_collection_test0');
    cy.get('[data-cy="body"]')
      .contains('approval_collection_test1')
      .should('not.exist');
    cy.get('[data-cy="body"]')
      .contains('approval_namespace_test_additional_data')
      .should('not.exist');
  });

  it('should filter non existing namespace and not show any data', () => {
    cy.get('[data-cy="body"] [data-cy="compound_filter"] button:first').click();
    cy.contains(
      '[data-cy="body"] [data-cy="compound_filter"] a',
      'Namespace',
    ).click();
    cy.get('[data-cy="body"] [data-cy="compound_filter"] input').type(
      'namespace1354564sdfhdfhhfdf{enter}',
    );

    cy.get('[data-cy="body"]').contains('No results found');
  });

  it('should set page size', () => {
    cy.get('[data-cy="body"]')
      .get('[data-ouia-component-type="PF5/Pagination"] button:first')
      .click();
    cy.get('[data-cy="body"]').contains('20 per page').click();

    cy.get('[data-cy="sort_name"]').click();
    cy.get('[data-cy="sort_name"]').click();

    range(11).forEach((i) => {
      cy.get('[data-cy="body"]').contains(items[i]);
    });
  });

  it('should redirect to import logs', () => {
    cy.get(
      '[data-cy="kebab-toggle"]:first button[aria-label="Actions"]',
    ).click();
    cy.contains('View Import Logs').click();
    cy.contains('My imports');
    cy.get('.import-list');
  });
});
