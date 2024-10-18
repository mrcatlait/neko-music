import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Provider, Type } from '@nestjs/common'
import { QueryRunner } from 'typeorm'

export interface SeedInterface {
  up(queryRunner: QueryRunner): Promise<void>
  down(queryRunner: QueryRunner): Promise<void>
}

export class Seed {
  id: number | undefined
  timestamp: number
  name: string
  instance?: SeedInterface

  constructor(id: number | undefined, timestamp: number, name: string, instance?: SeedInterface) {
    this.id = id
    this.timestamp = timestamp
    this.name = name
    this.instance = instance
  }
}

export type SeedClass = new () => SeedInterface

export interface TypeOrmSeedModuleOptions {
  seedsRun?: boolean
  seeds?: (SeedClass | string)[]
  seedsTableName?: string
}

export interface TypeOrmSeedOptionsFactory {
  createOptions(): Promise<TypeOrmSeedModuleOptions> | TypeOrmSeedModuleOptions
}

export interface TypeOrmSeedModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useExisting?: Type<TypeOrmSeedOptionsFactory>
  useClass?: Type<TypeOrmSeedOptionsFactory>
  useFactory?: (...args: unknown[]) => Promise<TypeOrmSeedModuleOptions> | TypeOrmSeedModuleOptions
  inject?: (InjectionToken | OptionalFactoryDependency)[]
  extraProviders?: Provider[]
}
