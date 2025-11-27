import { Test } from '@nestjs/testing'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

import { AppModule } from '@/modules/app/app.module'
import { ConfigService } from '@/modules/config/services'
import { EnvironmentVariables } from '@/modules/config/interfaces'

let postgresContainer: StartedPostgreSqlContainer
export let app: NestFastifyApplication

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer('postgres:16-alpine').start()

  const config: EnvironmentVariables = {
    DATABASE_HOST: postgresContainer.getHost(),
    DATABASE_PORT: postgresContainer.getPort(),
    DATABASE_USERNAME: postgresContainer.getUsername(),
    DATABASE_PASSWORD: postgresContainer.getPassword(),
    DATABASE_NAME: postgresContainer.getDatabase(),
    // Application
    PORT: 3000,
    UI_URL: 'http://localhost:3000',
    // Telemetry
    TELEMETRY_SERVICE_NAME: 'test',
    TELEMETRY_EXPORTER_URL: 'http://localhost:3000',
    // Crypto
    SALT_ROUNDS: 10,
    // Authentication
    JWT_ACCESS_TOKEN_SECRET: 'test',
    JWT_ACCESS_TOKEN_EXPIRES_IN: '1h',
    JWT_REFRESH_TOKEN_SECRET: 'test',
    JWT_REFRESH_TOKEN_EXPIRES_IN: '1h',
    JWT_REFRESH_TOKEN_COOKIE_NAME: 'test',
  }

  const moduleBuilder = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      config,
    })

  const moduleRef = await moduleBuilder.compile()
  app = moduleRef.createNestApplication(new FastifyAdapter())

  await app.init()
  await app.getHttpAdapter().getInstance().ready()
})

afterAll(async () => {
  await app.close()
  await postgresContainer.stop()
})
