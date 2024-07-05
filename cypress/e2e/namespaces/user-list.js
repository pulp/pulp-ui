import { range } from 'lodash';

const uiPrefix = Cypress.env('uiPrefix');

describe('User list tests for sorting, paging and filtering', () => {
  const items = [];

  before(() => {
    cy.deleteTestUsers();
    cy.deleteTestUsers();
    cy.deleteTestUsers();
    cy.deleteTestUsers();

    range(20).forEach((i) => {
      const name = 'user_test' + i;
      items.push(name);
      cy.galaxykit('user create', name, name + 'password');
    });

    items.push('admin');

    items.sort();
  });

  beforeEach(() => {
    cy.login();
    cy.visit(`${uiPrefix}users`);
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
    cy.get('.pulp-section').contains(items[0]);

    cy.get('.pulp-section').get('[aria-label="Go to next page"]:first').click();
    cy.get('.pulp-section').contains(items[10]);

    cy.get('.pulp-section').get('[aria-label="Go to next page"]:first').click();
    cy.get('.pulp-section').contains(items[20]);
  });

  it('sorting', () => {
    cy.get('.pulp-section').get('[data-cy="sort_username"]').click();
    cy.get('.pulp-section tbody tr:first td:first').contains(items[20]);
    cy.get('.pulp-section').contains(items[0]).should('not.exist');
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

    range(20).forEach((i) => {
      cy.get('.pulp-section').contains(items[i]);
    });

    cy.get('.pulp-section').contains(items[20]).should('not.exist');
  });
});
