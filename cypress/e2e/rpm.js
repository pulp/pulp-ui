describe('RPM plugin tests', () => {
    beforeEach(() => cy.login());

    it ('RPM Empty Packages', () => {
        cy.ui('rpm/rpms');
        cy.assertTitle('Packages');

        cy.contains('No packages yet');
    });

    it ('RPM Empty Repositories', () => {
        cy.ui('rpm/repositories');
        cy.assertTitle('Repositories');

        cy.contains('No repositories yet');
    });

    it ('RPM Add Repository', () => {
        cy.ui('rpm/repositories');
        cy.contains('button', 'Add repository').click();

        cy.assertTitle('Add new repository');

        cy.get('#name').type('Test Repository');
        cy.get('#description').type('This is a test repository');

        cy.contains('button', 'Save').click();
        cy.assertTitle('Test Repository');
        cy.contains('Test Repository');
    });

    it ('RPM Remove Repository', () => {
        cy.ui('rpm/repositories');
        cy.contains('Test Repository').click();

        cy.contains('button', 'Delete').click();
        cy.contains('Are you sure you want to delete the repository Test Repository?');

        cy.get('[role="dialog"]').contains('button', 'Delete').click();
        cy.assertTitle('Repositories');
        cy.contains('No repositories yet');
    });
});
