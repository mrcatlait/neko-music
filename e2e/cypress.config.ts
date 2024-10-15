import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'tests/**/*.spec.ts',
    screenshotsFolder: 'reports/screenshots',
    videosFolder: 'reports/videos',
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: 'support/config.ts',
    fixturesFolder: 'fixtures',
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'reports/junit-[hash].xml',
    },
  },
})
