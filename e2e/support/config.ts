import '@neko/web-test-utils/commands'

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
})

beforeEach(() => {
  cy.task('db:teardown', null, { timeout: 30000 })
  cy.task('db:seed', null, { timeout: 30000 })
})
