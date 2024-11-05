describe('screenshots', () => {
  beforeEach(() => {
    cy.login();
  });

  it('takes screenshots', () => {
    const screenshot = (path, options = {}) => {
      const filename = path.replaceAll('/', '__').replace(/^__$/, 'root');

      cy.go(path);

      cy.screenshot(filename, options);
    };

    screenshot('');

    screenshot('collections');
    screenshot('namespaces');
    screenshot('ansible/repositories', { blackout: ['time'] });
    screenshot('ansible/remotes');
    screenshot('token');
    screenshot('approval');
    screenshot('my-imports');

    screenshot('containers');
    screenshot('registries');

    screenshot('tasks', { blackout: ['time'] });
    screenshot('signature-keys', {
      blackout: ['time', '[data-cy=pulp-signature-list-fingerprint]'],
    });

    screenshot('users', { blackout: ['time'] });
    screenshot('group-list');
    screenshot('roles', { blackout: ['time'] });

    screenshot('settings/user-profile');
  });
});
