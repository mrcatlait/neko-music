describe('User Login', () => {
  it('should successfully login with valid credentials', () => {
    authentication.loginWithCredentials({
      username: '',
    })

    authentication.assertSuccessfulLogin()
  })

  it('should handle invalid credentials', () => {
    authentication.loginWithCredentials({
      username: '',
    })

    authentication.assertFailedLogin()
  })
})
