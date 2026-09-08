import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8002',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/commands.ts',
  },
  // NOTE: Only record videos when running in debug mode
  video: !!process.env.RUNNER_DEBUG,
  viewportHeight: 1080,
  viewportWidth: 1920,
  expose: {
    apiBasePath: '/pulp/api/v3/',
    uiBasePath: '/ui/',
  },
  env: {
    username: 'admin',
    password: 'admin',
  },
});
