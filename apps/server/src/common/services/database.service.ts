import { Script, ScriptClass, ScriptInterface } from './types'

import { sql } from 'src/db'

export interface DatabaseOptions {
  migrationsRun?: boolean
  migrations?: ScriptClass[]
  migrationsTableName?: string

  seedsRun?: boolean
  seeds?: ScriptClass[]
  seedsTableName?: string
}

export class DatabaseService {
  private readonly options: DatabaseOptions
  private readonly migrationsTableName: string = 'migrations'
  private readonly seedsTableName: string = 'seeds'

  private readonly seeds: ScriptInterface[] = []
  private readonly migrations: ScriptInterface[] = []

  constructor(options: DatabaseOptions) {
    this.options = options

    if (options.migrationsTableName) {
      this.migrationsTableName = options.migrationsTableName
    }

    if (options.seedsTableName) {
      this.seedsTableName = options.seedsTableName
    }

    if (options.migrations) {
      this.migrations = this.buildScripts(options.migrations)
    }

    if (options.seeds) {
      this.seeds = this.buildScripts(options.seeds)
    }
  }

  async connect(): Promise<void> {
    await sql`
      SELECT 1
    `

    if (this.options.migrationsRun) {
      await this.executePendingMigrations()
    }

    if (this.options.seedsRun) {
      await this.executePendingSeeds()
    }
  }

  private async executePendingSeeds() {
    await this.createTableIfNotExist(this.seedsTableName)
    const pendingSeeds = await this.getPendingScripts(this.seeds, this.seedsTableName)

    for (const seed of pendingSeeds) {
      await this.executeScript(seed, this.seedsTableName)
    }
  }

  private async executePendingMigrations() {
    await this.createTableIfNotExist(this.migrationsTableName)
    const pendingMigrations = await this.getPendingScripts(this.migrations, this.migrationsTableName)

    for (const migration of pendingMigrations) {
      await this.executeScript(migration, this.migrationsTableName)
    }
  }

  private async executeScript(script: Script, tableName: string) {
    await script.instance?.up(sql)
    await this.insertExecutedScript(script, tableName)
  }

  private async getPendingScripts(scripts: ScriptInterface[], tableName: string): Promise<Script[]> {
    const allScripts = this.getAllScripts(scripts)
    const executedScripts = await this.loadExecutedScripts(tableName)

    return allScripts.filter((script) => !executedScripts.find((executedScript) => executedScript.name === script.name))
  }

  private getAllScripts(scriptInterfaces: ScriptInterface[]): Script[] {
    const scripts = scriptInterfaces.map((script) => {
      const scriptClassName = (script.constructor as { name: string }).name
      const namePattern = /^v\d+_.+$/

      if (!scriptClassName || !namePattern.test(scriptClassName)) {
        throw new Error(
          `${scriptClassName} script name is wrong. Script class name should be in the format of "v<number>-<name>"`,
        )
      }

      return new Script(undefined, scriptClassName, script)
    })

    this.checkForDuplicateScripts(scripts)

    return scripts.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
  }

  private async loadExecutedScripts(tableName: string): Promise<Script[]> {
    const scriptsRaw = await sql<{ id: string; name: string }[]>`
      SELECT *
      FROM ${sql(tableName)}
      ORDER BY name DESC
    `

    return scriptsRaw.map((scriptRaw) => {
      return new Script(parseInt(scriptRaw.id), scriptRaw.name)
    })
  }

  private insertExecutedScript(script: Script, tableName: string): Promise<unknown> {
    return sql`
      INSERT INTO ${sql(tableName)} (name)
      VALUES (${script.name})
    `
  }

  private async createTableIfNotExist(tableName: string): Promise<void> {
    const tableExist = await this.hasTable(tableName)

    if (!tableExist) {
      await sql`
        CREATE TABLE IF NOT EXISTS ${sql(tableName)} (
          "id" SERIAL PRIMARY KEY,
          "name" varchar NOT NULL
        )
      `
    }
  }

  private buildScripts(scripts: ScriptClass[]): ScriptInterface[] {
    return scripts.map((script) => new script())
  }

  protected checkForDuplicateScripts(scripts: Script[]) {
    const scriptNames = scripts.map((script) => script.name)
    const duplicates = Array.from(
      new Set(scriptNames.filter((scriptName, index) => scriptNames.indexOf(scriptName) < index)),
    )

    if (duplicates.length > 0) {
      throw Error(`Duplicate script: ${duplicates.join(', ')}`)
    }
  }

  private async getCurrentSchema(): Promise<string> {
    const query = await sql`
      SELECT * FROM current_schema()
    `

    return query[0]['current_schema']
  }

  private async hasTable(tableName: string): Promise<boolean> {
    const schema = await this.getCurrentSchema()

    const result = await sql`
      SELECT *
      FROM "information_schema"."tables"
      WHERE "table_schema" = ${schema} AND "table_name" = ${tableName}
    `

    return result.length ? true : false
  }
}
