describe('Task table contains correct headers and filter', () => {
  it('table contains all columns and filter', () => {
    cy.login();
    cy.ui('ansible/repositories');

    cy.contains('Repositories');

    cy.get('[aria-label="Actions"]').eq(1).click();
    cy.get('tr').eq(2).contains('Sync').click();
    cy.get('.pf-v5-c-modal-box__footer .pf-m-primary').contains('Sync').click();

    cy.get('.pf-v5-c-alert.pf-m-info');

    cy.ui('tasks');
    cy.contains('Task Management');
    cy.get('[aria-label="name__contains"]');
    ['Task name', 'Created on', 'Started at', 'Finished at', 'Status'].forEach(
      (item) => {
        cy.get('tr[data-cy="SortTable-headers"] th').contains(item);
      },
    );
  });
});
