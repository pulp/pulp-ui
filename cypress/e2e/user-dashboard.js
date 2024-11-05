describe('Pulp User Management Tests', () => {
  describe('prevents super-user and self deletion', () => {
    it("the super-user can't delete themselves", () => {
      cy.login();
      cy.ui('users');

      const actionsSelector = `[data-cy="UserList-row-admin"] [aria-label="Actions"]`;
      cy.get(actionsSelector).click();
      cy.get('button').contains('Delete').should('be.disabled');
      cy.get('button').contains('Cancel').click();
    });
  });
});
