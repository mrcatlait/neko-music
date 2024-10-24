import * as dotenv from 'dotenv'
import { Injectable, Logger } from '@nestjs/common'
import Joi from 'joi'

import { NODE_ENV } from '@common/constants'

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
  // Bcrypt
  USER_PASSWORD_SALT_ROUNDS: number
  // Root user
  ROOT_USER_EMAIL: string
  ROOT_USER_PASSWORD: string
}

@Injectable()
export class ConfigService {
  private readonly envConfig: Config
  private readonly logger: Logger

  constructor() {
    this.logger = new Logger(this.constructor.name)

    dotenv.config()
    const config = process.env
    this.envConfig = this.validateInput(config)
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: { [key: string]: unknown }): Config {
    const envVarsSchema = Joi.object<Config>({
      NODE_ENV: Joi.any().allow(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION, NODE_ENV.TEST).required(),
      PORT: Joi.number().required(),
      UI_URL: Joi.string().uri().required(),
      MEDIA_URL: Joi.string().uri().required(),
      POSTGRES_HOST: Joi.string().hostname().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      COOKIE_SECRET: Joi.string().length(32).required(),
      USER_PASSWORD_SALT_ROUNDS: Joi.number().default(10),
      ROOT_USER_EMAIL: Joi.string().email().required(),
      ROOT_USER_PASSWORD: Joi.string().required(),
    }).unknown()

    const { error, value } = envVarsSchema.validate(envConfig)

    if (error) {
      this.logger.error(`Config validation error: ${error.message}`)
      process.exit(1)
    }

    return value
  }

  get<Key extends keyof Config>(key: Key): Config[Key] {
    return this.envConfig[key]
  }
}
