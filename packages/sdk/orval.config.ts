import { defineConfig } from 'orval';

const targetUrl = 'http://localhost:8080/pulp/api/v3/docs/api.json?pk_path=1';

export default defineConfig({
  core: {
    input: {
      target: targetUrl,
      filters: {
        mode: 'include',
        tags: ['Status'],
      },
    },
    output: {
      client: 'fetch',
      mode: 'tags-split',
      target: './src/core/core.ts',
      schemas: { path: './src/core/models', splitByTags: true },
      indexFiles: false,
      override: {
        mutator: {
          path: './src/mutator/pulp-fetch.ts',
          name: 'pulpFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});
