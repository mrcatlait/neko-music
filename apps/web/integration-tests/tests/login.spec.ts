import { login, navigation } from '@neko/web-test-utils/dsl'

import { interceptors } from 'integration-tests/interceptors'

describe('Login', () => {
  beforeEach(() => {
    navigation.goToLogin()
  })

  it('should display the login form', () => {
    login.assertVisible()
  })

  it('should display an error message when invalid credentials are provided', () => {
    interceptors.mockInvalidCredentials()

    login.login({
      email: 'invalid-email@example.com',
      password: 'invalid-password',
    })

    login.assertCredentialsErrorVisible()
  })

  it('should navigate to homepage after login', () => {
    interceptors.mockValidCredentials()

    login.login({
      email: 'valid-email@example.com',
      password: 'valid-password',
    })

    cy.url().should('eq', Cypress.config().baseUrl)
  })

  it('should navigate to the registration page', () => {
    login.assertRegistrationLink()
  })

  describe('Email', () => {
    it('should display an error message when the email is empty', () => {
      login.setEmail('valid-email@example.com')
      login.setEmail('')
      login.assertEmailError('Field is required')
    })

    it('should display an error message when the email is invalid', () => {
      login.setEmail('invalid-email')
      login.assertEmailError('Field must be in the format name@example.com')
    })
  })

  describe('Password', () => {
    it('should display an error message when the password is empty', () => {
      login.setPassword('valid-password')
      login.setPassword('')
      login.assertPasswordError('Field is required')
    })

    it('should toggle password visibility when the visibility button is clicked', () => {
      login.setPassword('valid-password')
      login.clickPasswordVisibilityButton()
      login.assertPasswordVisibility(true)
      login.clickPasswordVisibilityButton()
      login.assertPasswordVisibility(false)
    })
  })
})
