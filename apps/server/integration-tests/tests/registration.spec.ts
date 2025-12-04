import { auth } from '../dsl'

describe('Registration', () => {
  it('should successfully register a user', async () => {
    ;(await auth.register({ email: 'test@example.com' })).assertSuccess()
  })

  it('should fail to register a user if email is already in use', async () => {
    ;(await auth.register({ email: 'test@example.com' })).assertSuccess()
    ;(await auth.register({ email: 'test@example.com' })).assertFailure()
  })

  /**
   * @todo Test email and password validation
   */
})
