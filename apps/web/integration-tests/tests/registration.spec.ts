import { navigation, registration } from '@neko/web-test-utils/dsl'

describe('Registration', () => {
  beforeEach(() => {
    navigation.goToRegistration()
  })

  it('should display the login form', () => {
    registration.assertVisible()
  })

  it('should navigate to the login page', () => {
    registration.assertLoginLink()
  })

  describe('Username', () => {
    it('should display an error message when the username is empty', () => {
      registration.setUsername('valid-username')
      registration.setUsername('')
      registration.assertUsernameError('Field is required')
    })
  })

  describe('Email', () => {
    it('should display an error message when the email is empty', () => {
      registration.setEmail('valid-email@example.com')
      registration.setEmail('')
      registration.assertEmailError('Field is required')
    })

    it('should display an error message when the email is invalid', () => {
      registration.setEmail('invalid-email')
      registration.assertEmailError('Field must be in the format name@example.com')
    })
  })

  describe('Password', () => {
    it('should display an error message when the password is empty', () => {
      registration.setPassword('valid-password')
      registration.setPassword('')
      registration.assertPasswordError('Field is required')
    })

    it('should display an error message when the password is too short', () => {
      registration.setPassword('short')
      registration.assertPasswordError('Field must be at least 6 characters long')
    })

    it('should toggle password visibility when the visibility button is clicked', () => {
      registration.setPassword('valid-password')
      registration.clickPasswordVisibilityButton()
      registration.assertPasswordVisibility(true)
      registration.clickPasswordVisibilityButton()
      registration.assertPasswordVisibility(false)
    })
  })
})
