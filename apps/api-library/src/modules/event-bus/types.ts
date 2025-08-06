import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Provider, Type } from '@nestjs/common'

import { MessagingStrategy } from './strategies/messaging'

export interface EventBusModuleOptions {
  messagingStrategy: MessagingStrategy
}

export interface EventBusOptionsFactory {
  createOptions(): Promise<EventBusModuleOptions> | EventBusModuleOptions
}

export interface EventBusModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useExisting?: Type<EventBusOptionsFactory>
  useClass?: Type<EventBusOptionsFactory>
  useFactory?: (...args: unknown[]) => Promise<EventBusModuleOptions> | EventBusModuleOptions
  inject?: (InjectionToken | OptionalFactoryDependency)[]
  extraProviders?: Provider[]
}
