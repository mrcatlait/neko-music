import { Inject, Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'
import { CompiledQuery } from 'kysely'

import { DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { DatabaseMigrationService } from './database-migration.service'
import type { Database, DatabaseModuleOptions } from '../types'
import { InjectDatabase } from '../database.injector'
import { DatabaseSeedService } from './database-seed.service'
import { FailedDatabaseConnectException } from '../exceptions'

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly retryInterval: number
  private readonly maxRetries: number

  private readonly logger = new Logger(this.constructor.name)

  constructor(
    @InjectDatabase() private readonly database: Database<unknown>,
    @Inject(DATABASE_MODULE_OPTIONS) private readonly options: DatabaseModuleOptions,
    private readonly databaseMigrationService: DatabaseMigrationService,
    private readonly databaseSeedService: DatabaseSeedService,
  ) {
    this.retryInterval = options.retryInterval ?? 3000
    this.maxRetries = options.maxRetries ?? 10
  }

  async onApplicationBootstrap() {
    try {
      await this.connect()
      this.logger.log('Connected to database')

      if (this.options.runMigrations) {
        await this.databaseMigrationService.executePendingScripts()
      }

      if (this.options.runSeeds) {
        await this.databaseSeedService.executePendingScripts()
      }
    } catch (error) {
      this.logger.error('Failed to connect to database', error)
      process.exit(1)
    }
  }

  async connect(): Promise<void> {
    let attempts = 0

    while (attempts < this.maxRetries) {
      try {
        await this.database.executeQuery<number>(CompiledQuery.raw('SELECT 1'))
        return
      } catch {
        attempts = attempts + 1
        this.logger.error(`Failed to connect to database, retrying... (${attempts}/${this.maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, this.retryInterval))
      }
    }

    throw new FailedDatabaseConnectException()
  }
}
