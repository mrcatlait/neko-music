import { Environment } from '../enums'

export interface EnvironmentVariables {
  // Application
  PORT: number
  NODE_ENV: Environment
  // Database
  DATABASE_HOST: string
  DATABASE_PORT: number
  DATABASE_USERNAME: string
  DATABASE_PASSWORD: string
  DATABASE_NAME: string
  // Telemetry
  TELEMETRY_SERVICE_NAME: string
  TELEMETRY_EXPORTER_URL: string
  // Crypto
  SALT_ROUNDS: number
  // JWT
  JWT_SECRET: string
  JWT_TOKEN_EXPIRATION_TIME: string
  JWT_REFRESH_SECRET: string
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string
}
