describe('Task detail', () => {
  it('contains correct headers and field names', () => {
    cy.login();
    cy.ui('ansible/repositories');

    cy.contains('Repositories');

    cy.get('[aria-label="Actions"]').eq(1).click();
    cy.get('tr').eq(2).contains('Sync').click();
    cy.get('.pf-v5-c-modal-box__footer .pf-m-primary').contains('Sync').click();

    cy.get('.pf-v5-c-alert.pf-m-info');

    cy.ui('tasks');
    cy.contains('pulp_ansible.app.tasks.collections.sync').click();

    cy.contains('h1', 'Collections sync');
    cy.contains('.card-area h2', 'Task detail');
    cy.contains('.card-area h2', 'Task groups');
    cy.contains('.card-area h2', 'Reserve resources');

    // rest of the content in containers
    [
      'Task name',
      'Created on',
      'Finished at',
      'Task group',
      'Parent task',
      'Child task',
    ].forEach((item) => {
      cy.contains('.card-area', item);
    });
  });
});
