import { Elysia, t } from 'elysia'

import { refreshTokenAuth } from '../plugins'

import { Container } from '@common/di'
import { parseTimePeriod } from '@common/utils'
import { ConfigService } from '@common/config'
import { LoginHandler } from '@features/authentication/login/commands'
import { RefreshTokenHandler } from '@features/authentication/token/commands'
import { RegisterHandler } from '@features/authentication/registration/commands'

const REFRESH_TOKEN_COOKIE_NAME = 'neko.refresh.token'

export const authController = () => {
  const refreshTokenExpiresAt = Container.get(ConfigService).get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')

  return new Elysia({
    prefix: '/auth',
    detail: { tags: ['Authentication'] },
  })
    .model(
      'body.accessToken',
      t.Object({
        accessToken: t.String(),
      }),
    )
    .decorate('loginHandler', Container.get(LoginHandler))
    .post(
      '/login',
      async ({ loginHandler, cookie, body }) => {
        const { accessToken, refreshToken } = await loginHandler.handle({
          email: body.email,
          password: body.password,
        })

        cookie[REFRESH_TOKEN_COOKIE_NAME].set({
          value: refreshToken,
          expires: new Date(Date.now() + parseTimePeriod(refreshTokenExpiresAt)),
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })

        return {
          accessToken,
        }
      },
      {
        body: t.Object({
          email: t.String({ format: 'email' }),
          password: t.String(),
        }),
        response: 'body.accessToken',
        detail: {
          summary: 'Login',
          description: 'Login the user',
        },
      },
    )
    .use(refreshTokenAuth())
    .decorate('refreshTokenHandler', Container.get(RefreshTokenHandler))
    .get(
      '/refresh',
      async ({ refreshTokenHandler, cookie, store: { jwtPayload, token } }) => {
        const { accessToken, refreshToken } = await refreshTokenHandler.handle({
          token,
          jwtPayload,
        })

        cookie[REFRESH_TOKEN_COOKIE_NAME].set({
          value: refreshToken,
          expires: new Date(Date.now() + parseTimePeriod(refreshTokenExpiresAt)),
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })

        return {
          accessToken,
        }
      },
      {
        authenticated: true,
        response: 'body.accessToken',
        detail: {
          summary: 'Refresh token',
          description: 'Refresh the access token',
        },
      },
    )
    .get(
      '/logout',
      ({ cookie }) => {
        cookie[REFRESH_TOKEN_COOKIE_NAME].remove()
      },
      {
        cookie: t.Cookie({
          [REFRESH_TOKEN_COOKIE_NAME]: t.String(),
        }),
        detail: {
          summary: 'Logout',
          description: 'Logout the user',
        },
      },
    )
    .decorate('registerHandler', Container.get(RegisterHandler))
    .post(
      '/register',
      async ({ body, registerHandler, cookie }) => {
        const { accessToken, refreshToken } = await registerHandler.handle(body)

        cookie[REFRESH_TOKEN_COOKIE_NAME].set({
          value: refreshToken,
          expires: new Date(Date.now() + parseTimePeriod(refreshTokenExpiresAt)),
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })

        return {
          accessToken,
        }
      },
      {
        body: t.Object({
          email: t.String({ format: 'email' }),
          password: t.String({ minLength: 6 }),
        }),
        response: 'body.accessToken',
        detail: {
          summary: 'Register',
          description: 'Register a new user',
        },
      },
    )
}
