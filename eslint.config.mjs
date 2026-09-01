import jsEslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginCypress from 'eslint-plugin-cypress';
import pluginLingui from 'eslint-plugin-lingui';
import pluginReact from 'eslint-plugin-react/configs/recommended.js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
// NOTE: Whilst not fully bundling in ESM, this is needed when importing .json files.
// REF: https://nodejs.org/api/esm.html#json-modules
import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  jsEslint.configs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.stylistic,
  pluginLingui.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsEslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        // FIXME: This workaround uses the react version within package.json to avoid this plugin calling removed ESLint function in V10.
        // REF: https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
        version: pkg.dependencies.react,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    extends: [
      // NOTE: This is a fix for the workaround using eslint-plugin-react within plugins. All functionality is still achieved by importing fully to `/configs/recommended.js`.
      // REF: https://github.com/jsx-eslint/eslint-plugin-react/issues/3693
      pluginReact,
    ],
    rules: {
      curly: ['error', 'all'],
      'eol-last': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      'lingui/no-expression-in-message': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              importNames: [
                'Alert',
                'Breadcrumb',
                'Chip',
                'ChipGroup',
                'ClipboardCopy',
                'ClipboardCopyButton',
                'FileUpload',
                'Icon',
                'LabelGroup',
                'LoginForm',
                'NavList',
                'Pagination',
                'Popover',
                'SearchInput',
                'Spinner',
                'Tooltip',
              ],
              message: 'Import from src/components instead.',
              name: '@patternfly/react-core',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['config/*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['src/components/patternfly-wrappers/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['cypress/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      cypress: pluginCypress,
    },
    extends: [pluginCypress.configs.recommended, pluginCypress.configs.globals],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]);
