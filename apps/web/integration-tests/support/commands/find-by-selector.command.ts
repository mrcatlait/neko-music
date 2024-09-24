declare global {
  namespace Cypress {
    interface Chainable {
      findBySelector: (selector: string) => Cypress.Chainable<JQuery<HTMLElement>>
    }
  }
}

export const findBySelector = (
  subject: Cypress.Chainable<JQuery<HTMLElement>>,
  selector: string,
): Cypress.Chainable<JQuery<HTMLElement>> => {
  return subject.find(`[data-test='${selector}']`)
}
