import { loginSelectors } from '@selectors'

export const assertions = {
  assertVisible() {
    cy.getBySelector(loginSelectors.titleLabel).contains('Sign in to').should('be.visible')

    cy.getBySelector(loginSelectors.emailTextField).should('be.visible')
    cy.getBySelector(loginSelectors.emailLabel).should('be.visible')
    cy.getBySelector(loginSelectors.emailErrorLabel).should('be.empty')

    cy.getBySelector(loginSelectors.passwordTextField).should('be.visible')
    cy.getBySelector(loginSelectors.passwordLabel).should('be.visible')
    cy.getBySelector(loginSelectors.passwordErrorLabel).should('be.empty')

    cy.getBySelector(loginSelectors.submitButton).should('be.visible')
    cy.getBySelector(loginSelectors.noAccountLabel).should('be.visible')
    cy.getBySelector(loginSelectors.invalidCredentialsLabel).should('not.exist')
  },

  assertEmailError(error: string) {
    cy.getBySelector(loginSelectors.emailErrorLabel).contains(error).should('be.visible')
  },

  assertPasswordError(error: string) {
    cy.getBySelector(loginSelectors.passwordErrorLabel).contains(error).should('be.visible')
  },

  assertCredentialsErrorVisible() {
    cy.getBySelector(loginSelectors.invalidCredentialsLabel).should('be.visible')
  },

  assertRegistrationLink() {
    cy.getBySelector(loginSelectors.registrationLink).should('be.visible').should('have.attr', 'href')
  },

  assertPasswordVisibility(isVisible: boolean) {
    cy.getBySelector(loginSelectors.passwordTextField).should(isVisible ? 'have.attr' : 'not.have.attr', 'type', 'text')
  },
}
