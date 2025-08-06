import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Provider, Type } from '@nestjs/common'

export interface AsyncModuleOptionsFactory<Options> {
  createOptions(): Promise<Options> | Options
}

export interface AsyncModuleOptions<Options> extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useExisting?: Type<AsyncModuleOptionsFactory<Options>>
  useClass?: Type<AsyncModuleOptionsFactory<Options>>
  useFactory?: (...args: unknown[]) => Promise<Options> | Options
  inject?: (InjectionToken | OptionalFactoryDependency)[]
  extraProviders?: Provider[]
}
