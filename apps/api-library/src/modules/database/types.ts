import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Provider, Type } from '@nestjs/common'

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

export interface DatabaseOptionsFactory {
  createOptions(): Promise<DatabaseModuleOptions> | DatabaseModuleOptions
}

export interface DatabaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useExisting?: Type<DatabaseOptionsFactory>
  useClass?: Type<DatabaseOptionsFactory>
  useFactory?: (...args: unknown[]) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions
  inject?: (InjectionToken | OptionalFactoryDependency)[]
  extraProviders?: Provider[]
}
