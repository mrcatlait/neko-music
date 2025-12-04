import { Inject, Injectable } from '@nestjs/common'

import type { Database, DatabaseModuleOptions } from '../types'
import { DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { InjectDatabase } from '../database.injector'
import { DatabasePropagationService } from './database-propagation.service'

@Injectable()
export class DatabaseSeedService extends DatabasePropagationService {
  protected readonly tableName: string = 'seeds'
  protected readonly scriptsFolder: string

  constructor(
    @InjectDatabase() protected readonly database: Database,
    @Inject(DATABASE_MODULE_OPTIONS)
    private readonly options: DatabaseModuleOptions,
  ) {
    super(database)

    if (options.seeds) {
      this.scriptsFolder = options.seeds
    }

    if (options.seedsTableName) {
      this.tableName = options.seedsTableName
    }
  }
}
