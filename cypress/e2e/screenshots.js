describe('screenshots', () => {
  it('takes screenshots', () => {
    const screenshot = (path, options = {}) => {
      const filename = path.replaceAll('/', '_').replace(/^$/, 'status');
      cy.ui(path);
      cy.screenshot(filename, options);
    };

    cy.login();

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
