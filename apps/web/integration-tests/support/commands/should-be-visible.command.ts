declare global {
  namespace Cypress {
    interface Chainable {
      shouldBeVisible: () => Cypress.Chainable<JQuery<HTMLElement>>
    }
  }
}

export const shouldBeVisible = (subject: JQuery<HTMLElement>): Cypress.Chainable<JQuery<HTMLElement>> => {
  expect(subject[0].checkVisibility()).to.be.true
  return cy.wrap(subject)
}
