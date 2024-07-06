describe('Namespaces Page Tests', () => {
  it('can navigate to admin public namespace list', () => {
    cy.login();
    cy.menuGo('Collections > Namespaces');
    cy.contains('testns2').should('exist');
    cy.contains('testns1').should('exist');
  });

  it('can navigate to user public namespace list', () => {
    cy.login('testUser2', 'p@ssword1');
    cy.menuGo('Collections > Namespaces');

    cy.contains('testns2').should('exist');
    cy.contains('testns1').should('exist');
  });
});
