import { afterAll, beforeAll } from 'bun:test'

import { PostgreSqlContainer, StartedPostgreSqlContainer } from './utils/postges.container'

import { ConfigService, Environment } from '@common/config'
import { DatabaseService } from '@common/database'
import { Container } from '@common/di'

export const createTestConfigService = (customConfig: Partial<Environment> = {}) => {
  const defaultConfig: Environment = {
    PORT: 3000,
    DATABASE_HOST: 'localhost',
    DATABASE_PORT: 5432,
    DATABASE_USERNAME: 'test',
    DATABASE_PASSWORD: 'test',
    DATABASE_NAME: 'test',
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: '7d',
    JWT_TOKEN_EXPIRATION_TIME: '15m',
    JWT_ISSUER: 'test-issuer',
    JWT_AUDIENCE: 'test-audience',
  }

  return {
    get: <Key extends keyof Environment>(key: Key): Environment[Key] => {
      if (customConfig[key]) {
        return customConfig[key]
      }

      return defaultConfig[key]
    },
  }
}

let postgresContainer: StartedPostgreSqlContainer

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer().start()

  Container.set(ConfigService, createTestConfigService())
  await Container.get(DatabaseService).onApplicationBootstrap()
})

afterAll(async () => {
  await postgresContainer.stop()
})
