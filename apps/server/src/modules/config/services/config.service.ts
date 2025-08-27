import { Inject, Injectable, Logger } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { z } from 'zod'

import { CONFIG_MODULE_OPTIONS } from '../tokens'
import { ConfigModuleOptions } from '../types'
import { EnvironmentVariables } from '../interfaces'
import { environmentSchema } from '../schema'

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(this.constructor.name)

  private environmentVariables: EnvironmentVariables
  private readonly schema = environmentSchema
  private readonly abortOnValidationError: boolean

  constructor(@Inject(CONFIG_MODULE_OPTIONS) private readonly options: ConfigModuleOptions) {
    this.abortOnValidationError = options.abortOnValidationError ?? true
    this.initialize()
  }

  initialize() {
    dotenv.config()

    try {
      this.environmentVariables = this.schema.parse(process.env) as EnvironmentVariables
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (this.abortOnValidationError) {
          const errors = error.issues.map((issue) => this.getValidationErrorMessages(issue)).join('; ')
          throw new Error(`Invalid environment variables: ${errors}`)
        }
      } else {
        throw error
      }
    }
  }

  private getValidationErrorMessages(issue: z.core.$ZodIssue): string {
    return `${issue.path.join('.')}: ${issue.message}`
  }

  get config(): EnvironmentVariables {
    return this.environmentVariables
  }
}
