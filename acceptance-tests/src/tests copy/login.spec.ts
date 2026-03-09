import { auth } from '../dsl'

describe('Login', () => {
  it('should successfully login a user', async () => {
    await auth.register({ email: 'test@example.com', password: 'password123' })
    ;(await auth.login({ email: 'test@example.com', password: 'password123' })).assertSuccess()
  })

  it('should fail to login a user if email is incorrect', async () => {
    ;(await auth.login({ email: 'incorrect@example.com', password: 'password123' })).assertFailure()
  })

  it('should fail to login a user if password is incorrect', async () => {
    await auth.register({ email: 'test@example.com', password: 'password123' })
    ;(await auth.login({ email: 'test@example.com', password: 'incorrect' })).assertFailure()
  })
})
