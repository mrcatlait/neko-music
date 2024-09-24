import { defineConfig } from 'cypress'
import { config } from 'dotenv'

config()

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200/',
    specPattern: 'integration-tests/**/*.spec.ts',
    screenshotsFolder: 'reports/integration/screenshots',
    videosFolder: 'reports/integration/videos',
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: 'integration-tests/config.ts',
    fixturesFolder: 'integration-tests/fixtures',
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'reports/integration/junit-[hash].xml',
    },
  },
})
