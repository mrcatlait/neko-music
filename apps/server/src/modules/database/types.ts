import { Kysely, Selectable } from 'kysely'

import { AuthSchema, BackstageSchema, CatalogSchema, MediaSchema, UserSchema } from './schemas'

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

export type DatabaseSchema = AuthSchema & BackstageSchema & CatalogSchema & MediaSchema & UserSchema

export type Database = Kysely<DatabaseSchema>

export type FindOptions<T> = Partial<Selectable<T>>
