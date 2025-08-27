export interface DatabaseModuleOptions {
  runMigrations?: boolean
  migrations?: string
  migrationsTableName?: string
  runSeeds?: boolean
  seeds?: string
  seedsTableName?: string
  host: string
  port: number
  username: string
  password: string
  database: string
}
