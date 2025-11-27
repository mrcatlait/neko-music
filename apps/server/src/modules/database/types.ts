import { Kysely, Selectable } from 'kysely'

import { AuthSchema } from './schemas'

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
}

export type DatabaseSchema = AuthSchema

export type Database = Kysely<DatabaseSchema>

export type FindOptions<T> = Partial<Selectable<T>>
