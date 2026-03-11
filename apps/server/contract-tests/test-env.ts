import { EnvironmentVariables } from '@/modules/config/interfaces'

export const testEnvConfig: EnvironmentVariables = {
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: 5432,
  DATABASE_USERNAME: 'postgres',
  DATABASE_PASSWORD: 'postgres',
  DATABASE_NAME: 'test',
  PORT: 3000,
  UI_URL: 'http://localhost:3000',
  TELEMETRY_SERVICE_NAME: 'test',
  TELEMETRY_EXPORTER_URL: 'http://localhost:3000',
  SALT_ROUNDS: 10,
  JWT_ACCESS_TOKEN_SECRET: 'test',
  JWT_ACCESS_TOKEN_EXPIRES_IN: '1h',
  JWT_REFRESH_TOKEN_SECRET: 'test',
  JWT_REFRESH_TOKEN_EXPIRES_IN: '1h',
}
