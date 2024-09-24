import { Selectors } from '../types'

export const loginSelectors = {
  titleLabel: 'login-title-label',
  emailTextField: 'login-email-text-field',
  passwordTextField: 'login-password-text-field',
  submitButton: 'login-submit-button',
  noAccountLabel: 'login-no-account-label',
  registrationLink: 'login-registration-link',
  invalidCredentialsLabel: 'login-invalid-credentials-label',
} satisfies Selectors
