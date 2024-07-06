import { range } from 'lodash';

const uiPrefix = Cypress.env('uiPrefix');

describe('Group list tests for sorting, paging and filtering', () => {
  const items = [];

  before(() => {
    range(21).forEach((i) => {
      const name = 'group_test' + i;
      items.push(name);
    });

    items.sort();
  });

  beforeEach(() => {
    cy.login();
    cy.visit(`${uiPrefix}group-list`);
  });

  it('table contains all columns', () => {
    cy.get('tr[data-cy="SortTable-headers"] th').contains('Group');
  });

  it('paging', () => {
    cy.get('.pulp-section').contains(items[0]);

    cy.get('.pulp-section').get('[aria-label="Go to next page"]:first').click();
    cy.get('.pulp-section').contains(items[10]);

    cy.get('.pulp-section').get('[aria-label="Go to next page"]:first').click();
    cy.get('.pulp-section').contains(items[20]);
  });

  it('sorting', () => {
    cy.get('.pulp-section').get('[data-cy="sort_name"]').click();
    cy.get('.pulp-section tbody tr:first td:first').contains(items[20]);
    cy.get('.pulp-section').contains(items[0]).should('not.exist');
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

    range(20).forEach((i) => {
      cy.get('.pulp-section').contains(items[i]);
    });

    cy.get('.pulp-section').contains(items[20]).should('not.exist');
  });
});
