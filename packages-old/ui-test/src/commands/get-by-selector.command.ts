declare global {
  namespace Cypress {
    interface Chainable {
      getBySelector: typeof getBySelector
    }
  }
}

export const getBySelector = (selector: string): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.get(`[data-test='${selector}']`)
}
