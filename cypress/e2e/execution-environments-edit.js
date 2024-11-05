describe('containers', () => {
  const num = (~~(Math.random() * 1000000)).toString();

  before(() => {
    cy.login();
    cy.addLocalContainer(`localpine${num}`, 'alpine');
  });

  beforeEach(() => {
    cy.login();
    cy.menuGo('Containers > Containers');
  });

  it('edits a remote container', () => {
    cy.contains('a', `remotepine${num}`).click();
    cy.get('.pf-v5-c-button.pf-m-secondary').contains('Edit').click();
    cy.get('#description').type('This is the description.');
    cy.contains('button', 'Save').click();
    cy.get('[data-cy=description]').should(
      'have.text',
      'This is the description.',
    );
  });

  it('edits a local container', () => {
    cy.contains('a', `localpine${num}`).click();
    cy.get('.pf-v5-c-button.pf-m-secondary').contains('Edit').click();
    cy.get('#description').type('This is the description.');
    cy.contains('button', 'Save').click();
    cy.get('[data-cy=description]').should(
      'have.text',
      'This is the description.',
    );
  });
});
