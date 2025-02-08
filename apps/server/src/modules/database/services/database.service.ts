import { Inject, Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'
import postgres from 'postgres'
import { BehaviorSubject } from 'rxjs'

import { DatabaseModuleOptions } from '../types'
import { DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { DatabaseMigrationService } from './database-migration.service'

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly RETRIES_INTERVAL = 3000
  private readonly MAX_RETRIES = 10

  private readonly logger = new Logger(DatabaseService.name)

  private readonly initializedSubject = new BehaviorSubject(false)
  readonly initialized$ = this.initializedSubject.asObservable()

  readonly sql = postgres({
    host: this.options.host,
    port: this.options.port,
    username: this.options.username,
    password: this.options.password,
    database: this.options.database,
  })

  constructor(
    @Inject(DATABASE_MODULE_OPTIONS) private readonly options: DatabaseModuleOptions,
    private readonly databaseMigrationService: DatabaseMigrationService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.connect()
      this.logger.log('Connected to database')
      await this.databaseMigrationService.executePendingMigrations()
    } catch (error) {
      this.logger.error('Failed to connect to database', error)
      process.exit(1)
    }
  }

  async connect(): Promise<void> {
    let retries = 0

    while (retries < this.MAX_RETRIES) {
      try {
        await this.sql`
          SELECT 1
        `
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
