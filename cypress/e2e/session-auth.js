const sessionPage = (username, csrfToken = 'test-csrf-token') => `
  <html>
    <body>
      ${
        username
          ? `<a class="dropdown-toggle" href="#">${username}</a>`
          : '<a href="/auth/login/">Log in</a>'
      }
      <form>
        <input name="csrfmiddlewaretoken" value="${csrfToken}">
      </form>
    </body>
  </html>
`;

const configureSSO = () => {
  cy.intercept('GET', '/pulp-ui-config.json', {
    API_BASE_PATH: '/pulp/api/v3/',
    UI_BASE_PATH: '/ui/',
    UI_EXTERNAL_LOGIN_URI: '/auth/login/',
    EXTRA_VERSION: '',
  });
};

describe('Session authentication', () => {
  it('restores an authenticated Django session', () => {
    configureSSO();
    cy.intercept('GET', '/pulp/api/v3/users/?limit=1', {
      headers: { 'content-type': 'text/html' },
      body: sessionPage('sso-user'),
    });

    cy.ui('about');

    cy.get('[data-cy=user-dropdown]').contains('sso-user');
    cy.get('[data-cy=pulp-menu-item-Login]').should('not.exist');
    cy.window()
      .then((window) => window.sessionStorage.getItem('credentials'))
      .should('be.null');
    cy.window()
      .then((window) => window.localStorage.getItem('credentials'))
      .should('be.null');
  });

  it('does not trust cached session identity', () => {
    configureSSO();
    cy.intercept('GET', '/pulp/api/v3/users/?limit=1', {
      headers: { 'content-type': 'text/html' },
      body: sessionPage(null),
    });

    cy.visit('/ui/about/', {
      onBeforeLoad(window) {
        window.sessionStorage.credentials = JSON.stringify({
          username: 'stale-user',
          password: '',
          remember: false,
          authentication: 'session',
        });
      },
    });

    cy.get('[data-cy=user-dropdown]').should('not.exist');
    cy.get('[data-cy=pulp-menu-item-Login]').should('exist');
  });

  it('posts the Django logout and clears the local identity', () => {
    configureSSO();
    let authenticated = true;

    cy.intercept('GET', '/pulp/api/v3/users/?limit=1', (request) => {
      request.reply({
        headers: { 'content-type': 'text/html' },
        body: sessionPage(authenticated ? 'sso-user' : null),
      });
    });
    cy.intercept('POST', '/auth/logout/', (request) => {
      authenticated = false;
      request.reply({ statusCode: 204 });
    }).as('logout');

    cy.ui('about');
    cy.get('[data-cy=user-dropdown]').click();
    cy.contains('a', 'Logout').click();

    cy.wait('@logout');
    cy.get('[data-cy=user-dropdown]').should('not.exist');
    cy.get('[data-cy=pulp-menu-item-Login]').should('exist');
  });
});
