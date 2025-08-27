import { Inject, Injectable } from '@nestjs/common'

import type { DatabaseModuleOptions } from '../types'
import { DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { DatabasePropagationService } from './database-propagation.service'

@Injectable()
export class DatabaseMigrationService extends DatabasePropagationService {
  protected readonly tableName: string = 'migrations'

  constructor(
    @Inject(DATABASE_MODULE_OPTIONS)
    private readonly options: DatabaseModuleOptions,
  ) {
    super({
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      scriptsFolder: options.migrations,
      tableName: options.migrationsTableName,
    })
  }
}
