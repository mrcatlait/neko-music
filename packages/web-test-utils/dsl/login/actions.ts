import { loginSelectors } from '../../selectors'

export const actions = {
  setPassword(password: string) {
    if (password) {
      cy.getBySelector(loginSelectors.passwordTextField).clear().type(password).blur()
    } else {
      cy.getBySelector(loginSelectors.passwordTextField).clear().click().blur()
    }
  },

  setEmail(email: string) {
    if (email) {
      cy.getBySelector(loginSelectors.emailTextField).clear().type(email).blur()
    } else {
      cy.getBySelector(loginSelectors.emailTextField).clear().click().blur()
    }
  },

  login(payload: { email: string; password: string }) {
    actions.setEmail(payload.email)
    actions.setPassword(payload.password)

    cy.getBySelector(loginSelectors.submitButton).click()
  },

  clickPasswordVisibilityButton() {
    cy.getBySelector(loginSelectors.passwordVisibilityButton).click()
  },
}
