import { defineConfig, devices } from '@playwright/test';

const baseUrl: string = process.env.BASE_URL ?? 'http://localhost:8002';
const runningInPipeline: boolean = process.env.CI === 'true' ? true : false;

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: runningInPipeline,
  retries: runningInPipeline ? 2 : 0,
  workers: runningInPipeline ? 1 : undefined,
  reporter: runningInPipeline ? 'github' : 'html',
  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: baseUrl,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      API_PROXY: process.env.API_PROXY ?? 'http://localhost:8080',
    },
  },
});
