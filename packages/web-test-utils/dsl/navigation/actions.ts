import { routes } from '../../routes'
import { navigationSelectors } from '../../selectors'

export const actions = {
  goToHome() {
    cy.visit(routes.HOME)
  },

  goToExplore() {
    cy.getBySelector(navigationSelectors.exploreLink).click()
  },
}
