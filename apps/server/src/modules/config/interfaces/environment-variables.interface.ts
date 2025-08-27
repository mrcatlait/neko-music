export interface EnvironmentVariables {
  // Application
  PORT: number
  UI_URL: string

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
  JWT_ACCESS_TOKEN_SECRET: string
  JWT_ACCESS_TOKEN_EXPIRES_IN: number
  JWT_REFRESH_TOKEN_SECRET: string
  JWT_REFRESH_TOKEN_EXPIRES_IN: number
  JWT_REFRESH_TOKEN_COOKIE_NAME: string
}
