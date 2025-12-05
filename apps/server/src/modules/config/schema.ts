import { z, ZodType } from 'zod'

import { EnvironmentVariables } from './interfaces'

export const environmentSchema = z.object({
  // Application
  PORT: z.coerce.number().default(3000),
  UI_URL: z.string().url(),

  // Database
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  // Telemetry
  TELEMETRY_SERVICE_NAME: z.string(),
  TELEMETRY_EXPORTER_URL: z.string().url(),

  // Crypto
  SALT_ROUNDS: z.coerce.number(),

  // Authentication
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_COOKIE_NAME: z.string().optional(),
}) satisfies ZodType<EnvironmentVariables>
