import { Inject, Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'
import { BehaviorSubject } from 'rxjs'
import { CompiledQuery } from 'kysely'

import { DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { DatabaseMigrationService } from './database-migration.service'
import type { Database, DatabaseModuleOptions } from '../types'
import { InjectDatabase } from '../database.injector'

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly RETRIES_INTERVAL = 3000
  private readonly MAX_RETRIES = 10

  private readonly logger = new Logger(this.constructor.name)

  private readonly initializedSubject = new BehaviorSubject(false)
  readonly initialized$ = this.initializedSubject.asObservable()

  constructor(
    @InjectDatabase() private readonly database: Database,
    @Inject(DATABASE_MODULE_OPTIONS) private readonly options: DatabaseModuleOptions,
    private readonly databaseMigrationService: DatabaseMigrationService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.connect()
      this.logger.log('Connected to database')

      if (this.options.runMigrations) {
        await this.databaseMigrationService.executePendingScripts()
      }
    } catch (error) {
      this.logger.error('Failed to connect to database', error)
      process.exit(1)
    }
  }

  async connect(): Promise<void> {
    let retries = 0

    while (retries < this.MAX_RETRIES) {
      try {
        await this.database.executeQuery<number>(CompiledQuery.raw('SELECT 1'))

        this.initializedSubject.next(true)
        return
      } catch {
        retries = retries + 1
        this.logger.error(`Failed to connect to database, retrying... (${retries}/${this.MAX_RETRIES})`)
        await new Promise((resolve) => setTimeout(resolve, this.RETRIES_INTERVAL))
      }
    }

    throw new Error('Failed to connect to database')
  }
}
