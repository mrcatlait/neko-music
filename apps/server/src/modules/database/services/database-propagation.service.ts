import { Logger } from '@nestjs/common'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import postgres from 'postgres'

interface DatabasePropagationServiceOptions {
  host: string
  port: number
  username: string
  password: string
  database: string
  scriptsFolder?: string
  tableName?: string
}

export abstract class DatabasePropagationService {
  private readonly logger = new Logger(this.constructor.name)

  protected abstract readonly tableName: string

  private readonly scriptsFolder: string

  readonly sql = postgres({
    host: this.propagationOptions.host,
    port: this.propagationOptions.port,
    username: this.propagationOptions.username,
    password: this.propagationOptions.password,
    database: this.propagationOptions.database,
  })

  constructor(private readonly propagationOptions: DatabasePropagationServiceOptions) {
    if (propagationOptions.scriptsFolder) {
      this.scriptsFolder = propagationOptions.scriptsFolder
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

    await this.sql.end()

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
