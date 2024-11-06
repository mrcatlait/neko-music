import { registrationSelectors } from '../../selectors'

export const assertions = {
  assertVisible() {
    cy.getBySelector(registrationSelectors.titleLabel).contains('Sign up to').should('be.visible')

    cy.getBySelector(registrationSelectors.usernameTextField).should('be.visible')
    cy.getBySelector(registrationSelectors.usernameLabel).should('be.visible')
    cy.getBySelector(registrationSelectors.usernameErrorLabel).should('not.be.visible')

    cy.getBySelector(registrationSelectors.emailTextField).should('be.visible')
    cy.getBySelector(registrationSelectors.emailLabel).should('be.visible')
    cy.getBySelector(registrationSelectors.emailErrorLabel).should('not.be.visible')

    cy.getBySelector(registrationSelectors.passwordTextField).should('be.visible')
    cy.getBySelector(registrationSelectors.passwordLabel).should('be.visible')
    cy.getBySelector(registrationSelectors.passwordErrorLabel).should('not.be.visible')

    cy.getBySelector(registrationSelectors.submitButton).should('be.visible')
    cy.getBySelector(registrationSelectors.hasAccountLabel).should('be.visible')
  },

  assertUsernameError(error: string) {
    cy.getBySelector(registrationSelectors.usernameErrorLabel).contains(error).should('be.visible')
  },

  assertEmailError(error: string) {
    cy.getBySelector(registrationSelectors.emailErrorLabel).contains(error).should('be.visible')
  },

  assertPasswordError(error: string) {
    cy.getBySelector(registrationSelectors.passwordErrorLabel).contains(error).should('be.visible')
  },

  assertLoginLink() {
    cy.getBySelector(registrationSelectors.loginLink).should('be.visible').should('have.attr', 'href')
  },

  assertPasswordVisibility(isVisible: boolean) {
    cy.getBySelector(registrationSelectors.passwordTextField).should(
      isVisible ? 'have.attr' : 'not.have.attr',
      'type',
      'text',
    )
  },
}
