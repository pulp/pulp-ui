const ui = Cypress.env('UI_BASE_PATH');

const languageCheckHelper = (url, selector) => (language, message) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      if (language) {
        Object.defineProperty(win.navigator, 'languages', {
          value: [language],
        });
      }
    },
  });

  cy.get(selector).should('contain.text', message);
};

describe('Localization tests with the t`String` format', () => {
  const helper = languageCheckHelper(`${ui}tasks`, 'h1');

  beforeEach(() => {
    cy.login();
    cy.ui();
  });

  const translations = {
    en: 'Task management',
    fr: 'Gestion des tâches',
    ja: 'タスク管理',
    zh: '任务管理',
  };

  Object.entries(translations).forEach(([language, message]) => {
    it(`should display the correct translation in ${language}`, () => {
      helper(language, message);
    });
  });
});

describe('Localization tests with the <Trans> format', () => {
  const helper = languageCheckHelper(
    `${ui}containers`,
    '[data-cy="push-images-button"]',
  );

  beforeEach(() => {
    cy.login();
    cy.ui();
  });

  const translations = {
    en: 'Push container images',
    fr: 'Pousser images de conteneurs',
    ja: 'コンテナーイメージのプッシュ',
    zh: '推容器镜像',
  };

  Object.entries(translations).forEach(([language, message]) => {
    it(`should display the correct translation in ${language}`, () => {
      helper(language, message);
    });
  });
});
