import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
    video: false,
    screenshotOnRunFailure: false,
  },
  env: {
    TEST_EMAIL: 'deviaryn3@gmail.com',
    TEST_PASSWORD: 'akuntest123',
  },
});
