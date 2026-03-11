import { Kysely, Selectable } from 'kysely'

export interface DatabaseModuleOptions {
  // Database
  host: string
  port: number
  username: string
  password: string
  database: string

  // Migrations
  migrations?: string
  migrationsTableName?: string
  runMigrations?: boolean

  // Seeds
  seeds?: string
  seedsTableName?: string
  runSeeds?: boolean
}

export type Database<Schema> = Kysely<Schema>

export type FindOptions<T> = Partial<Selectable<T>>
