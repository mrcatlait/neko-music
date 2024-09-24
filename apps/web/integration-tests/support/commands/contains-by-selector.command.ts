declare global {
  namespace Cypress {
    interface Chainable {
      containsBySelector: typeof containsBySelector
    }
  }
}

export const containsBySelector = (selector: string, value: string): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.contains(`[data-test='${selector}']`, value)
}
