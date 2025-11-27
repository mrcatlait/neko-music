import { Inject, Injectable, Logger } from '@nestjs/common'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { CompiledQuery } from 'kysely'

import type { Database, DatabaseModuleOptions } from '../types'
import { DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { InjectDatabase } from '../database.injector'

@Injectable()
export class DatabaseMigrationService {
  private readonly logger = new Logger(this.constructor.name)

  private readonly tableName: string = 'migrations'
  private readonly scriptsFolder: string

  constructor(
    @InjectDatabase() private readonly database: Database,
    @Inject(DATABASE_MODULE_OPTIONS)
    private readonly options: DatabaseModuleOptions,
  ) {
    if (options.migrations) {
      this.scriptsFolder = options.migrations
    }

    if (options.migrationsTableName) {
      this.tableName = options.migrationsTableName
    }
  }

  async executePendingScripts() {
    if (!this.scriptsFolder) {
      this.logger.warn(`No scripts folder provided, skipping execution of scripts`)
      return
    }

    await this.createTableIfNotExist(this.tableName)
    const pendingMigrations = await this.getPendingScripts(this.scriptsFolder, this.tableName)

    this.logger.log(`Detected pending scripts: ${pendingMigrations.length}`)

    for (const migration of pendingMigrations) {
      const sql = readFileSync(join(this.scriptsFolder, migration), 'utf-8')
      await this.executeScript(migration, sql, this.tableName)
    }

    this.logger.log(`Executed scripts: ${pendingMigrations.length}`)
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
    this.logger.log(`Executing script: ${name}`)
    await this.database.executeQuery<void>(CompiledQuery.raw(sql))
    await this.insertExecutedScript(name, tableName)
  }

  private async loadExecutedScripts(tableName: string): Promise<string[]> {
    const { rows } = await this.database.executeQuery<{ name: string }>(
      CompiledQuery.raw(`SELECT name FROM "${tableName}" ORDER BY name DESC`),
    )

    return rows.map((row) => row.name)
  }

  private insertExecutedScript(name: string, tableName: string): Promise<unknown> {
    return this.database.executeQuery<void>(CompiledQuery.raw(`INSERT INTO "${tableName}" (name) VALUES ('${name}')`))
  }

  private async createTableIfNotExist(tableName: string): Promise<void> {
    const tableExist = await this.hasTable(tableName)

    if (!tableExist) {
      await this.database.executeQuery<void>(
        CompiledQuery.raw(`CREATE TABLE IF NOT EXISTS ${tableName} (id SERIAL PRIMARY KEY, name varchar NOT NULL)`),
      )
    }
  }

  private async getCurrentSchema(): Promise<string> {
    const { rows } = await this.database.executeQuery<{ current_schema: string }>(
      CompiledQuery.raw('SELECT current_schema()'),
    )

    return rows[0].current_schema
  }

  private async hasTable(tableName: string): Promise<boolean> {
    const schema = await this.getCurrentSchema()

    const { rows } = await this.database.executeQuery<{ current_schema: string }>(
      CompiledQuery.raw(
        `SELECT * FROM "information_schema"."tables" WHERE "table_schema" = '${schema}' AND "table_name" = '${tableName}'`,
      ),
    )

    return rows.length > 0
  }
}
