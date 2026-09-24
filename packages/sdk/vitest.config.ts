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
    ],
    coverage: {
      provider: 'v8',
    },
    exclude: [...configDefaults.exclude],
  },
});
