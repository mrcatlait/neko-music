import { auth } from '../dsl'

describe('Refresh', () => {
  it('should successfully refresh a user', async () => {
    await auth.register({ email: 'test@example.com' })
    ;(await auth.refresh()).assertSuccess()
  })

  it('should fail to refresh a user if refresh token is invalid', async () => {
    ;(await auth.refresh({ cookies: 'invalid-token' })).assertFailure()
  })
})
