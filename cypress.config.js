// https://on.cypress.io/configuration
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8002',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  video: !!process.env.RUNNER_DEBUG, // only record videos when running github action in debug mode
  viewportHeight: 1080,
  viewportWidth: 1920,
});
