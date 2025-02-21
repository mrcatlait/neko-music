import { navigationSelectors } from '@selectors'
import { routes } from '@routes'

export const actions = {
  goToHome() {
    cy.visit(routes.HOME)
  },

  goToExplore() {
    cy.getBySelector(navigationSelectors.exploreLink).click()
  },

  goToLogin() {
    cy.visit(routes.LOGIN)
  },

  goToRegistration() {
    cy.visit(routes.REGISTRATION)
  },
}
