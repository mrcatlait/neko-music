import { registrationSelectors } from '../../selectors'

export const actions = {
  setUsername(username: string) {
    if (username) {
      cy.getBySelector(registrationSelectors.usernameTextField).clear().type(username).blur()
    } else {
      cy.getBySelector(registrationSelectors.usernameTextField).clear().click().blur()
    }
  },

  setPassword(password: string) {
    if (password) {
      cy.getBySelector(registrationSelectors.passwordTextField).clear().type(password).blur()
    } else {
      cy.getBySelector(registrationSelectors.passwordTextField).clear().click().blur()
    }
  },

  setEmail(email: string) {
    if (email) {
      cy.getBySelector(registrationSelectors.emailTextField).clear().type(email).blur()
    } else {
      cy.getBySelector(registrationSelectors.emailTextField).clear().click().blur()
    }
  },

  register(payload: { username: string; email: string; password: string }) {
    actions.setUsername(payload.username)
    actions.setEmail(payload.email)
    actions.setPassword(payload.password)

    cy.getBySelector(registrationSelectors.submitButton).click()
  },

  clickPasswordVisibilityButton() {
    cy.getBySelector(registrationSelectors.passwordVisibilityButton).click()
  },
}
