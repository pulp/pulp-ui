describe('RPM plugin tests', () => {
    beforeEach(() => cy.login());

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            Cypress.stop()
        }
    })

    it('Empty distributions', () => {
        cy.ui('rpm/distributions');
        cy.assertTitle('Distributions');

        cy.contains('No distributions yet');
    });

    it('Empty packages', () => {
        cy.ui('rpm/rpms');
        cy.assertTitle('Packages');

        cy.contains('No packages yet');
    });

    it('Empty repositories', () => {
        cy.ui('rpm/repositories');
        cy.assertTitle('Repositories');

        cy.contains('No repositories yet');
    });

    it('Empty remotes', () => {
        cy.ui('rpm/remotes');
        cy.assertTitle('Remotes');

        cy.contains('No remotes yet');
    });

    it('Add distribution', () => {
        cy.ui('rpm/distributions');
        cy.contains('button', 'Create distribution').click();

        cy.assertTitle('Add new distribution');

        cy.get('#name').type('Bare Test Distribution');
        cy.get('#base_path').type('bare-test-distribution');

        cy.contains('button', 'Save').click();
        cy.assertTitle('Bare Test Distribution');
        cy.contains('Bare Test Distribution');
    })

    it('Add remote', () => {
        cy.ui('rpm/remotes');
        cy.contains('button', 'Add remote').click();

        cy.assertTitle('Add new remote');

        cy.get('#name').type('Test Remote');
        cy.get('#url').type('https://fixtures.pulpproject.org/rpm-repo-metadata/');

        cy.contains('button', 'Save').click();
        cy.assertTitle('Test Remote');
        cy.contains('Test Remote');
    });

    it('Add repository with a remote and distribution', () => {
        cy.ui('rpm/repositories');
        cy.contains('button', 'Add repository').click();

        cy.assertTitle('Add new repository');

        cy.get('#name').type('Test Repository');
        cy.get('#description').type('This is a test repository');

        cy.get('input[id="create_distribution"]').should('be.checked');
        cy.get('label[for="create_distribution"]').contains('Test Repository');

        cy.get('input[placeholder="Select a remote"]').click();
        cy.contains('Test Remote').click();

        cy.contains('button', 'Save').click();
        cy.assertTitle('Test Repository');
        cy.contains('Test Repository');
    });

    it('Sync a repository', () => {
        cy.ui('rpm/repositories');
        cy.contains('Test Repository').click();

        cy.contains('button', 'Sync').click();

        let packagesSynced = false;
        for (let i = 0; i < 30; i++) {
            cy.ui('rpm/rpms');
            packagesSynced = cy.contains('No packages yet');
            if (packagesSynced) {
                break;
            }
            cy.wait(1000);
        }
        packagesSynced;
    });

    it ('Edit remote', () => {
        cy.ui('rpm/remotes');
        cy.contains('Test Remote').click();

        cy.contains('button', 'Edit').click();
        cy.assertTitle('Test Remote');

        cy.get('#url').clear().type('https://fixtures.pulpproject.org/rpm-repo-metadata-changed/');

        cy.contains('button', 'Save').click();
        cy.assertTitle('Test Remote');
        cy.assertListText('https://fixtures.pulpproject.org/rpm-repo-metadata-changed/');
    })
    

    it ('Edit repository', () => {
        cy.ui('rpm/repositories');
        cy.contains('Test Repository').click();

        cy.contains('button', 'Edit').click();
        cy.assertTitle('Test Repository');

        cy.get('#description').clear().type('This is an updated test repository');

        cy.contains('button', 'Save').click();
        cy.assertTitle('Test Repository');
        cy.assertListText('This is an updated test repository');
    })
    
    it ('Edit distribution', () => {
        cy.ui('rpm/distributions');
        cy.contains('Test Distribution').click();

        cy.contains('button', 'Edit').click();
        cy.assertTitle('Test Distribution');

        cy.get('#base_path').clear().type('updated-base-path');

        cy.contains('button', 'Save').click();
        cy.assertTitle('Test Distribution');
        cy.assertListText('updated-base-path');
    })

    it('Remove distribution', () => {
        cy.ui('rpm/distributions');
        cy.contains('Bare Test Distribution').click();

        cy.contains('button', 'Delete').click();
        cy.contains('Are you sure you want to delete the distribution Bare Test Distribution?');

        cy.get('[role="dialog"]').contains('button', 'Delete').click();
        cy.assertTitle('Distributions');
        cy.contains('Bare Test Distribution').should('not.exist');
    })

    it('Remove last repository', () => {
        cy.ui('rpm/repositories');
        cy.contains('Test Repository').click();

        cy.contains('button', 'Delete').click();
        cy.contains('Are you sure you want to delete the repository Test Repository?');

        cy.get('[role="dialog"]').contains('button', 'Delete').click();
        cy.assertTitle('Repositories');
        cy.contains('No repositories yet');
    });

    it('Remove last remote', () => {
        cy.ui('rpm/remotes');
        cy.contains('Test Remote').click();

        cy.contains('button', 'Delete').click();
        cy.contains('Are you sure you want to delete the remote Test Remote?');

        cy.get('[role="dialog"]').contains('button', 'Delete').click();
        cy.assertTitle('Remotes');
        cy.contains('No remotes yet');
    });
});
