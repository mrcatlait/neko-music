import { Selectors } from './selector.model'

export const registrationSelectors = {
  titleLabel: 'registration-title-label',
  usernameTextField: 'registration-username-text-field',
  usernameErrorLabel: 'registration-username-error-label',
  usernameLabel: 'registration-username-label',
  emailTextField: 'registration-email-text-field',
  emailErrorLabel: 'registration-email-error-label',
  emailLabel: 'registration-email-label',
  passwordTextField: 'registration-password-text-field',
  passwordErrorLabel: 'registration-password-error-label',
  passwordLabel: 'registration-password-label',
  passwordVisibilityButton: 'registration-password-visibility-button',
  submitButton: 'registration-submit-button',
  hasAccountLabel: 'registration-has-account-label',
  loginLink: 'registration-login-link',
  usernameTakenLabel: 'registration-username-taken-label',
  emailTakenLabel: 'registration-email-taken-label',
} satisfies Selectors
