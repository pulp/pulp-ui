describe('Repository', () => {
  beforeEach(() => {
    cy.login();
    cy.ui('ansible/repositories');
  });

  it('tests Paging and sorting', () => {
    cy.contains('[data-cy="ListPage-AnsibleRepositoryList"]', '1 - 10 of 11');
    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [data-cy="sort_name"]',
    ).click();

    cy.contains('repoListTest1');
    cy.contains('certified');
    cy.contains('validated');
    cy.contains('repoListTest3');
    cy.contains('community').should('not.exist');

    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [data-action="next"]:first',
    ).click();
    cy.contains('[data-cy="ListPage-AnsibleRepositoryList"]', '11 of 11');

    cy.contains('repoListTest1').should('not.exist');
    cy.contains('certified').should('not.exist');
    cy.contains('validated').should('not.exist');
    cy.contains('repoListTest3').should('not.exist');
    cy.contains('community');

    cy.ui('ansible/repositories');
    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [data-cy="sort_name"]',
    ).click();
    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [data-cy="sort_name"]',
    ).click();

    cy.contains('repoListTest1');
    cy.contains('certified');
    cy.contains('validated').should('not.exist');
    cy.contains('repoListTest3');
    cy.contains('community');

    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [data-action="next"]:first',
    ).click();

    cy.contains('repoListTest1').should('not.exist');
    cy.contains('certified').should('not.exist');
    cy.contains('validated');
    cy.contains('repoListTest3').should('not.exist');
    cy.contains('community').should('not.exist');
  });

  it('tests filtering', () => {
    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [data-cy="sort_name"]',
    ).click();
    cy.get('[data-cy="compound_filter"] input')
      .clear()
      .type('repoListTest{enter}');
    cy.contains('community').should('not.exist');
    cy.contains('validated').should('not.exist');
    cy.contains('certified').should('not.exist');

    cy.get('[data-cy="compound_filter"] input')
      .clear()
      .type('repoListTest4{enter}');
    cy.contains('repoListTest4');
    cy.contains('repoListTest0').should('not.exist');
    cy.contains('repoListTest1').should('not.exist');
    cy.contains('community').should('not.exist');
    cy.contains('validated').should('not.exist');
    cy.contains('certified').should('not.exist');

    cy.contains('Clear all filters').click();

    cy.contains('repoListTest4');
    cy.contains('repoListTest0');
    cy.contains('repoListTest1');
    cy.contains('community').should('not.exist');
    cy.contains('validated');
    cy.contains('certified');

    cy.get('[data-cy="compound_filter"] input').clear().type('test{enter}');

    cy.contains('community').should('not.exist');
    cy.contains('validated').should('not.exist');
    cy.contains('certified').should('not.exist');
  });

  it('tests deletion', () => {
    cy.get('[data-cy="compound_filter"] input')
      .clear()
      .type('repoListTest4{enter}');
    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [aria-label="Actions"]',
    ).click();
    cy.contains(
      '[data-cy="ListPage-AnsibleRepositoryList"] a',
      'Delete',
    ).click();
    cy.contains('Delete repository?');
    cy.contains('[data-cy="delete-button"] button', 'Delete').click();
    cy.contains('Removal started for repository repoListTest4');

    cy.ui('ansible/repositories');
    cy.get('[data-cy="compound_filter"] input')
      .clear()
      .type('repoListTest4{enter}');
    cy.contains('No results found');
  });

  it('tests edit', () => {
    cy.get('[data-cy="compound_filter"] input')
      .clear()
      .type('repoListTest3{enter}');
    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [aria-label="Actions"]',
    ).click();
    cy.contains('[data-cy="ListPage-AnsibleRepositoryList"] a', 'Edit').click();
    cy.get('[data-cy="Page-AnsibleRepositoryEdit"]');
  });

  it('tests CLI config', () => {
    cy.get('[data-cy="compound_filter"] input')
      .clear()
      .type('repoListTest3{enter}');
    cy.get(
      '[data-cy="ListPage-AnsibleRepositoryList"] [aria-label="Actions"]',
    ).click();
    cy.contains('Successfully copied to clipboard');
  });
});
