import Elysia, { t } from 'elysia'

import { authenticationPlugin, SESSION_COOKIE } from '../plugins'
import { AuthenticationContainer } from '../authentication.container'

import { UnauthorizedException } from '@common/exceptions'

export const authenticationController = new Elysia({ prefix: '/auth', detail: { tags: ['Authentication'] } })
  .use(authenticationPlugin)
  .post(
    'login',
    async ({ body, store: { session }, cookie }) => {
      const result = await AuthenticationContainer.getAuthenticationCommandService().login(body)

      const sessionId = Bun.randomUUIDv7()
      session.set(sessionId, result)
      cookie[SESSION_COOKIE].set({
        value: sessionId,
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      })

      return result
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
      }),
      authenticated: false,
      detail: {
        summary: 'Login',
        description: 'Login to the application',
      },
    },
  )
  .post(
    'logout',
    ({ store: { session }, cookie }) => {
      if (!cookie[SESSION_COOKIE].value) {
        throw new UnauthorizedException()
      }

      session.delete(cookie[SESSION_COOKIE].value)
      cookie[SESSION_COOKIE].remove()
    },
    {
      authenticated: true,
      detail: {
        summary: 'Logout',
        description: 'Logout from the application',
      },
    },
  )
  .get(
    'whoami',
    ({ user }) => {
      if (!user.id) {
        throw new UnauthorizedException()
      }

      return user
    },
    {
      authenticated: true,
      detail: {
        summary: 'Who am I',
        description: 'Get the current user',
      },
    },
  )
  .post(
    'register',
    async ({ body, store: { session }, cookie }) => {
      const result = await AuthenticationContainer.getAuthenticationCommandService().register(body)

      const sessionId = Bun.randomUUIDv7()
      session.set(sessionId, result)
      cookie[SESSION_COOKIE].set({
        value: sessionId,
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      })

      return result
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
      }),
      authenticated: false,
      detail: {
        summary: 'Register',
        description: 'Register a new user',
      },
    },
  )
