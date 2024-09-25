import { navigationSelectors } from 'selectors'
import { routes } from 'integration-tests/support/routes'

export const actions = {
  goToHome() {
    cy.visit(routes.HOME)
  },

  goToExplore() {
    cy.getBySelector(navigationSelectors.exploreLink).click()
  },
}
