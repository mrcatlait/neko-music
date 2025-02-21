import { Inject, Injectable, Logger } from '@nestjs/common'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import postgres from 'postgres'

import type { DatabaseModuleOptions } from '../types'
import { DATABASE_MODULE_OPTIONS } from '../database.tokens'

@Injectable()
export class DatabaseMigrationService {
  private readonly logger = new Logger(DatabaseMigrationService.name)

  private readonly migrationsTableName: string = 'migrations'

  readonly sql = postgres({
    host: this.options.host,
    port: this.options.port,
    username: this.options.username,
    password: this.options.password,
    database: this.options.database,
  })

  constructor(
    @Inject(DATABASE_MODULE_OPTIONS)
    private readonly options: DatabaseModuleOptions,
  ) {
    if (options.migrationsTableName) {
      this.migrationsTableName = options.migrationsTableName
    }
  }

  async executePendingMigrations() {
    this.logger.log('Executing pending migrations')
    await this.createTableIfNotExist(this.migrationsTableName)
    const pendingMigrations = await this.getPendingScripts(this.options.migrations, this.migrationsTableName)

    for (const migration of pendingMigrations) {
      const sql = readFileSync(join(this.options.migrations, migration), 'utf-8')
      await this.executeScript(migration, sql, this.migrationsTableName)
    }

    await this.sql.end()

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
    this.logger.log(`Executing migration: ${name}`)
    await this.sql.unsafe(sql)
    await this.insertExecutedScript(name, tableName)
  }

  private async loadExecutedScripts(tableName: string): Promise<string[]> {
    const scriptsRaw = await this.sql<{ name: string }[]>`
      SELECT name
      FROM ${this.sql(tableName)}
      ORDER BY name DESC
    `

    return scriptsRaw.map((scriptRaw) => scriptRaw.name)
  }

  private insertExecutedScript(name: string, tableName: string): Promise<unknown> {
    return this.sql`
      INSERT INTO ${this.sql(tableName)} (name)
      VALUES (${name})
    `
  }

  private async createTableIfNotExist(tableName: string): Promise<void> {
    const tableExist = await this.hasTable(tableName)

    if (!tableExist) {
      await this.sql`
        CREATE TABLE IF NOT EXISTS ${this.sql(tableName)} (
          "id" SERIAL PRIMARY KEY,
          "name" varchar NOT NULL
        )
      `
    }
  }

  private async getCurrentSchema(): Promise<string> {
    const query = await this.sql`
      SELECT * FROM current_schema()
    `

    return query[0]['current_schema']
  }

  private async hasTable(tableName: string): Promise<boolean> {
    const schema = await this.getCurrentSchema()

    const result = await this.sql`
      SELECT *
      FROM "information_schema"."tables"
      WHERE "table_schema" = ${schema} AND "table_name" = ${tableName}
    `

    return result.length ? true : false
  }
}
