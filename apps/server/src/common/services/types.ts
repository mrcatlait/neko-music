import postgres from 'postgres'

export type Sql = postgres.Sql<Record<string, unknown>>

export interface ScriptInterface {
  up(sql: Sql): Promise<void>
  down(sql: Sql): Promise<void>
}

export class Script {
  id: number | undefined
  name: string
  instance?: ScriptInterface

  constructor(id: number | undefined, name: string, instance?: ScriptInterface) {
    this.id = id
    this.name = name
    this.instance = instance
  }
}

export type ScriptClass = new () => ScriptInterface
