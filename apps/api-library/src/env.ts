import dotenv from 'dotenv'

import { EnvironmentVariables } from './modules/shared/models'

dotenv.config()

export const env: EnvironmentVariables = {
  PORT: process.env.PORT,
  UI_URL: process.env.UI_URL,
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,

  SALT_ROUNDS: process.env.SALT_ROUNDS,
  NODE_ENV: process.env.NODE_ENV,

  COOKIE_SECRET: process.env.COOKIE_SECRET,

  TELEMETRY_SERVICE_NAME: process.env.TELEMETRY_SERVICE_NAME,
  TELEMETRY_EXPORTER_URL: process.env.TELEMETRY_EXPORTER_URL,
}
