import { Inject, Injectable } from '@nestjs/common'

import type { Database, DatabaseModuleOptions } from '../types'
import { DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { InjectDatabase } from '../database.injector'
import { DatabasePropagationService } from './database-propagation.service'

@Injectable()
export class DatabaseMigrationService extends DatabasePropagationService {
  protected readonly tableName: string = 'migrations'
  protected readonly scriptsFolder: string

  constructor(
    @InjectDatabase() protected readonly database: Database<unknown>,
    @Inject(DATABASE_MODULE_OPTIONS)
    private readonly options: DatabaseModuleOptions,
  ) {
    super(database)

    if (options.migrations) {
      this.scriptsFolder = options.migrations
    }

    if (options.migrationsTableName) {
      this.tableName = options.migrationsTableName
    }
  }
}
