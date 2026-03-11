import { Test } from '@nestjs/testing'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { MessageStateHandlers } from '@pact-foundation/pact'
import { Reflector } from '@nestjs/core'
import fastifyCookie from '@fastify/cookie'

import { testEnvConfig } from './test-env'
import { authStateHandler } from './state-handlers'
import { authRepositoryMock, databaseMock, jwtServiceMock, userRepositoryMock } from './mocks'

import { PactModule, PactVerifierService } from 'contract-tests/pact.module'
import { AppModule } from '@/modules/app/app.module'
import { ConfigService } from '@/modules/config/services'
import { JwtService } from '@/modules/auth/services'
import { DatabaseService } from '@/modules/database/services'
import { DATABASE } from '@/modules/database/database.tokens'
import { AuthRepository } from '@/modules/auth/repositories'
import { UserRepository } from '@/modules/user/repositories'

describe('Pact Verification', () => {
  let verifierService: PactVerifierService
  let app: NestFastifyApplication

  beforeAll(async () => {
    const stateHandlers: MessageStateHandlers = {
      ...authStateHandler,
    }

    const requestFilter = (req: Request, res: Response, next: () => void) => {
      if (!req.headers['authorization']) {
        next()
        return
      }

      req.headers['authorization'] = `Bearer ${new Date().toISOString()}`
      next()
    }

    const moduleBuilder = Test.createTestingModule({
      imports: [PactModule.register({ stateHandlers, requestFilter }), AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({ config: testEnvConfig })
      .overrideProvider(DatabaseService)
      .useValue({})
      .overrideProvider(DATABASE)
      .useValue(databaseMock)
      .overrideProvider(AuthRepository)
      .useValue(authRepositoryMock)
      .overrideProvider(UserRepository)
      .useValue(userRepositoryMock)

    const moduleRef = await moduleBuilder.compile()

    verifierService = moduleRef.get(PactVerifierService)

    app = moduleRef.createNestApplication(new FastifyAdapter())

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    const reflector = app.get(Reflector)
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

    await app.register(fastifyCookie)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('validates the expectations of Matching Service', async () => {
    await verifierService.verify(app)
  })
})
