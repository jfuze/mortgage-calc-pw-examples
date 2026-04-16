import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  // setting the same amount of workers, though it would vary depending on CI runner specs
  workers: process.env.CI ? 4 : 4,
  reporter: 'list',
  use: {
    baseURL: 'https://mortgage-calculator-smoky.vercel.app',
    trace: process.env.CI ? 'on-first-retry' : 'on',
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
});
