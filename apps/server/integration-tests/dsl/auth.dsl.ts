import request from 'supertest'

import { Params, Context } from '../utils'
import { app } from '../test-setup'

interface RegisterOptions {
  email?: string
  password?: string
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
}
