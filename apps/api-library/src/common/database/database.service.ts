import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import postgres, { Sql } from 'postgres'

import { DatabaseOptions } from './types'

import { ConfigService } from '@common/config/config.service'
import { Container } from '@common/di'

export class DatabaseService {
  private readonly RETRIES_INTERVAL = 3000
  private readonly MAX_RETRIES = 10

  private readonly options: DatabaseOptions

  readonly sql: Sql

  private readonly migrationsTableName: string = 'migrations'
  private readonly migrations: string = join(process.cwd(), 'src', 'migrations')

  constructor() {
    const configService = Container.get(ConfigService)

    this.options = {
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USERNAME'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
    }

    this.sql = postgres(this.options)
  }

  async onApplicationBootstrap() {
    try {
      await this.connect()
      await this.executePendingMigrations()
    } catch {
      process.exit(1)
    }
  }

  private async connect(): Promise<void> {
    let retries = 0

    while (retries < this.MAX_RETRIES) {
      try {
        await this.sql`
          SELECT 1
        `
        console.log('Connected to database')
        return
      } catch {
        retries = retries + 1
        console.error(`Failed to connect to database, retrying... (${retries}/${this.MAX_RETRIES})`)
        await new Promise((resolve) => setTimeout(resolve, this.RETRIES_INTERVAL))
      }
    }

    throw new Error('Failed to connect to database')
  }

  private async executePendingMigrations() {
    console.log('Executing pending migrations')
    try {
      await this.createTableIfNotExist(this.migrationsTableName)
      const pendingMigrations = await this.getPendingScripts(this.migrations, this.migrationsTableName)

      for (const migration of pendingMigrations) {
        const sql = readFileSync(join(this.migrations, migration), 'utf-8')
        await this.executeScript(migration, sql, this.migrationsTableName)
      }

      console.log(`Pending migrations executed: ${pendingMigrations.length}`)
    } catch (error) {
      console.error(error)
      throw error
    }
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
