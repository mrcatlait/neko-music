import request from 'supertest'

import { ACCESS_TOKEN_HEADER_NAME } from '@/modules/auth/constants'
import { Params, Context } from '../utils'
import { app } from '../test-setup'

interface RegisterOptions {
  email?: string
  password?: string
}

interface LoginOptions {
  email?: string
  password?: string
}

interface RefreshOptions {
  cookies?: string
}

interface WhoAmIOptions {
  accessToken?: string
}

export class AuthDSL {
  constructor(private readonly context: Context) {}

  async register(options: RegisterOptions = {}) {
    const params = new Params<RegisterOptions>(this.context, options)

    const email = params.alias('email', 'test@example.com')
    const password = params.optional('password', 'password123')

    const response = await request(app.getHttpServer()).post('/auth/register').send({
      email,
      password,
      displayName: 'Test User',
    })

    this.context.setSession({
      cookies: response.headers['set-cookie']?.[0] ?? null,
      accessToken: response.body.accessToken ?? null,
      email,
    })

    return {
      assertSuccess: () => {
        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
          email,
          displayName: 'Test User',
          accessToken: expect.any(String),
          permissions: expect.any(Array),
        })
      },
      assertFailure: () => {
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
          message: ['emailTaken'],
        })
      },
    }
  }

  async login(options: LoginOptions = {}) {
    const params = new Params<LoginOptions>(this.context, options)

    const email = params.alias('email', 'test@example.com')
    const password = params.optional('password', 'password123')

    const response = await request(app.getHttpServer()).post('/auth/login').send({
      email,
      password,
    })

    this.context.setSession({
      cookies: response.headers['set-cookie']?.[0] ?? null,
      accessToken: response.body.accessToken ?? null,
      email,
    })

    return {
      assertSuccess: () => {
        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
          email,
          displayName: expect.any(String),
          accessToken: expect.any(String),
          permissions: expect.any(Array),
        })
      },
      assertFailure: () => {
        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({
          message: 'Unauthorized',
        })
      },
    }
  }

  async refresh(options: RefreshOptions = {}) {
    const cookies = options.cookies ?? this.context.cookies ?? ''

    const response = await request(app.getHttpServer()).get('/auth/refresh').set('Cookie', cookies)

    this.context.setSession({
      accessToken: response.body.accessToken ?? this.context.accessToken,
    })

    return {
      assertSuccess: () => {
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
          accessToken: expect.any(String),
        })
      },
      assertFailure: () => {
        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({
          message: 'Unauthorized',
        })
      },
    }
  }

  async whoami(options: WhoAmIOptions = {}) {
    const accessToken = options.accessToken ?? this.context.accessToken ?? ''

    const response = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set(ACCESS_TOKEN_HEADER_NAME, `Bearer ${accessToken}`)

    return {
      assertSuccess: () => {
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
          email: this.context.email ?? expect.any(String),
          displayName: expect.any(String),
          permissions: expect.any(Array),
        })
      },
      assertFailure: () => {
        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({
          message: 'Unauthorized',
        })
      },
    }
  }
}
