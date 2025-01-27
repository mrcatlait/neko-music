import { Inject, Injectable, OnApplicationBootstrap, Logger, forwardRef } from '@nestjs/common'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

import { DatabaseModuleOptions } from '../types'
import { DatabaseService } from './database.service'
import { DATABASE_MODULE_OPTIONS } from '../database.tokens'

@Injectable()
export class DatabaseMigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseMigrationService.name)

  private readonly migrationsTableName: string = 'migrations'

  constructor(
    @Inject(forwardRef(() => DatabaseService))
    private readonly databaseService: DatabaseService,
    @Inject(DATABASE_MODULE_OPTIONS) private readonly options: DatabaseModuleOptions,
  ) {
    if (options.migrationsTableName) {
      this.migrationsTableName = options.migrationsTableName
    }
  }

  // onApplicationBootstrap() {
  //   if (this.options.migrationsRun) {
  //     this.databaseService.initialized$.pipe(filter(Boolean), take(1)).subscribe({
  //       next: () => {
  //         // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //         this.executePendingMigrations()
  //       },
  //     })
  //   }
  // }

  async executePendingMigrations() {
    this.logger.log('Executing pending migrations')
    await this.createTableIfNotExist(this.migrationsTableName)
    const pendingMigrations = await this.getPendingScripts(this.options.migrations, this.migrationsTableName)

    for (const migration of pendingMigrations) {
      const sql = readFileSync(join(this.options.migrations, migration), 'utf-8')
      await this.executeScript(migration, sql, this.migrationsTableName)
    }

    this.logger.log(`Pending migrations executed: ${pendingMigrations.length}`)
  }

  private async getPendingScripts(scriptsFolder: string, tableName: string): Promise<string[]> {
    const allScripts = this.getAllScripts(scriptsFolder)
    const executedScripts = await this.loadExecutedScripts(tableName)

    return allScripts.filter((script) => !executedScripts.find((executedScript) => executedScript === script))
  }

  private getAllScripts(scriptsFolder: string): string[] {
    const scripts = readdirSync(scriptsFolder).filter((file) => file.endsWith('.sql'))
    return scripts.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  }

  private async executeScript(name: string, sql: string, tableName: string) {
    await this.databaseService.sql.unsafe(sql)
    await this.insertExecutedScript(name, tableName)
  }

  private async loadExecutedScripts(tableName: string): Promise<string[]> {
    const scriptsRaw = await this.databaseService.sql<{ name: string }[]>`
      SELECT name
      FROM ${this.databaseService.sql(tableName)}
      ORDER BY name DESC
    `

    return scriptsRaw.map((scriptRaw) => scriptRaw.name)
  }

  private insertExecutedScript(name: string, tableName: string): Promise<unknown> {
    return this.databaseService.sql`
      INSERT INTO ${this.databaseService.sql(tableName)} (name)
      VALUES (${name})
    `
  }

  private async createTableIfNotExist(tableName: string): Promise<void> {
    const tableExist = await this.hasTable(tableName)

    if (!tableExist) {
      await this.databaseService.sql`
        CREATE TABLE IF NOT EXISTS ${this.databaseService.sql(tableName)} (
          "id" SERIAL PRIMARY KEY,
          "name" varchar NOT NULL
        )
      `
    }
  }

  private async getCurrentSchema(): Promise<string> {
    const query = await this.databaseService.sql`
      SELECT * FROM current_schema()
    `

    return query[0]['current_schema']
  }

  private async hasTable(tableName: string): Promise<boolean> {
    const schema = await this.getCurrentSchema()

    const result = await this.databaseService.sql`
      SELECT *
      FROM "information_schema"."tables"
      WHERE "table_schema" = ${schema} AND "table_name" = ${tableName}
    `

    return result.length ? true : false
  }
}
