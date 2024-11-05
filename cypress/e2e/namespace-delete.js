describe('Delete a namespace', () => {
  beforeEach(() => {
    cy.login();
  });

  it('deletes a namespace', () => {
    cy.menuGo('Collections > Namespaces');

    cy.get(`a[href*="namespaces/testns1"]`).click();
    cy.get('[data-cy="ns-kebab-toggle"]').click();
    cy.contains('Delete namespace').click();
    cy.get('input[id=delete_confirm]').click();
    cy.get('button').contains('Delete').click();

    cy.contains('Namespace "testns1" has been successfully deleted.');
  });

  it('cannot delete a non-empty namespace', () => {
    // create namespace

    cy.menuGo('Collections > Namespaces');

    cy.get(`a[href*="namespaces/ansible"]`).click();

    // upload a collection & approve
    // attempt deletion

    cy.menuGo('Collections > Namespaces');

    cy.contains('ansible')
      .parents('.card-wrapper')
      .contains('View collections')
      .click();
    cy.get('[data-cy=ns-kebab-toggle]').click();
    cy.contains('Delete namespace')
      .invoke('attr', 'aria-disabled')
      .should('eq', 'true');
  });
});
