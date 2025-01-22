import { Selectors } from '../selector.model'

export const loginSelectors = {
  titleLabel: 'login-title-label',
  emailTextField: 'login-email-text-field',
  emailErrorLabel: 'login-email-error-label',
  emailLabel: 'login-email-label',
  passwordTextField: 'login-password-text-field',
  passwordErrorLabel: 'login-password-error-label',
  passwordLabel: 'login-password-label',
  passwordVisibilityButton: 'login-password-visibility-button',
  submitButton: 'login-submit-button',
  noAccountLabel: 'login-no-account-label',
  registrationLink: 'login-registration-link',
  invalidCredentialsLabel: 'login-invalid-credentials-label',
} satisfies Selectors
