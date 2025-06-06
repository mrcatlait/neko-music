import { Environment } from '../enums'

export interface EnvironmentVariables {
  // Application
  PORT: number
  UI_URL: string
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

  // Authentication
  COOKIE_SECRET: string
}
