import { defineConfig } from 'cypress'

import { seedDatabase, teardownDatabase } from './support/db'
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        'db:seed': () => {
          return seedDatabase()
        },
        'db:teardown': () => {
          return teardownDatabase()
        },
      })
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
