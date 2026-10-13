import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    tags: [
      {
        name: 'integration',
        description:
          'ACL client functions tested against MSW-mocked Pulp responses - not a real backend',
      },
      {
        name: 'unit',
        description:
          'Pure functions, Zod schemas, and ACL codecs - no network or DOM',
      },
      {
        name: 'component',
        description:
          'React components rendered with RTL in happy-dom - no network',
      },
    ],
    coverage: {
      provider: 'v8',
      exclude: ['**/*.zod.*', 'packages/sdk/src/core/**'],
    },
    exclude: [...configDefaults.exclude],
  },
});
