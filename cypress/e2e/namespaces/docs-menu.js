const uiPrefix = Cypress.env('uiPrefix');

describe('Documentation dropdown', () => {
  beforeEach(() => {
    cy.visit(uiPrefix);
    cy.login();
  });

  it('user can open docs dropdown menu', () => {
    cy.get('[data-cy="docs-dropdown"]').click();
    cy.get('.pf-v5-c-dropdown__menu').contains('Documentation');
    cy.get('.pf-v5-c-dropdown__menu').contains('About');
  });

  it('user can toggle about modal', () => {
    cy.get('[data-cy="docs-dropdown"]').click();
    cy.get('.pf-v5-c-dropdown__menu').contains('About').click();
    cy.get('.pf-v5-c-about-modal-box').should('be.visible');
    cy.get('h1').contains('Galaxy NG');
    cy.get('[aria-label="Close Dialog"]').click();
    cy.get('.pf-v5-c-about-modal-box').should('not.exist');
  });
});
