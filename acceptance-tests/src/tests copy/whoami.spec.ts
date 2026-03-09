import { auth } from '../dsl'

describe('Whoami', () => {
  it('should successfully get the current user', async () => {
    await auth.register({ email: 'test@example.com'})
    ;(await auth.whoami()).assertSuccess()
  })

  it('should fail to get the current user if access token is invalid', async () => {
    ;(await auth.whoami({ accessToken: 'invalid-token' })).assertFailure()
  })
})
