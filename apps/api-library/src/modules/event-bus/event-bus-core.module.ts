import { DynamicModule, Module, Provider, Type } from '@nestjs/common'

import { EventBusModuleAsyncOptions, EventBusModuleOptions, EventBusOptionsFactory } from './types'
import { EVENT_BUS_MODULE_OPTIONS } from './constants'
import { EventBusService, EventHandlerExplorerService } from './services'
import { ObservableMessagingStrategy } from './strategies/messaging'

const defaultEventBusModuleOptions: EventBusModuleOptions = {
  messagingStrategy: new ObservableMessagingStrategy(),
}

@Module({})
export class EventBusCoreModule {
  static forRoot(options?: EventBusModuleOptions): DynamicModule {
    const eventBusModuleOptions: Provider = {
      provide: EVENT_BUS_MODULE_OPTIONS,
      useValue: options || defaultEventBusModuleOptions,
    }

    const providers: Provider[] = [eventBusModuleOptions, EventBusService, EventHandlerExplorerService]

    return {
      module: EventBusCoreModule,
      providers,
      exports: [EventBusService],
    }
  }

  static forRootAsync(options: EventBusModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options)

    const providers: Provider[] = [
      ...asyncProviders,
      EventBusService,
      EventHandlerExplorerService,
      ...(options.extraProviders || []),
    ]

    return {
      module: EventBusCoreModule,
      imports: options.imports,
      providers,
      exports: [EventBusService],
    }
  }

  private static createAsyncProviders(options: EventBusModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    const useClass = options.useClass as Type<EventBusOptionsFactory>

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: EventBusModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: EVENT_BUS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    const inject = [(options.useClass || options.useExisting) as Type<EventBusOptionsFactory>]

    return {
      provide: EVENT_BUS_MODULE_OPTIONS,
      useFactory: (optionsFactory: EventBusOptionsFactory) => optionsFactory.createOptions(),
      inject,
    }
  }
}
