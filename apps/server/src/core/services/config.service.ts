import { NODE_ENV } from '@common/enums'

interface Config {
  NODE_ENV: NODE_ENV
  PORT: number
  UI_URL: string
  MEDIA_URL: string
  // Database
  POSTGRES_HOST: string
  POSTGRES_PORT: number
  POSTGRES_USER: string
  POSTGRES_PASSWORD: string
  POSTGRES_DB: string
  // Cookies
  COOKIE_SECRET: string
  // Crypto
  PASSWORD_PEPPER: string
  // Root user
  ROOT_USER_EMAIL: string
  ROOT_USER_PASSWORD: string
}

export class ConfigService {
  get<Key extends keyof Config>(key: Key): Config[Key] {
    return process.env[key] as Config[Key]
  }
}
