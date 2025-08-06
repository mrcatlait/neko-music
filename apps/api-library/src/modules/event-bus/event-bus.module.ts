import { DynamicModule, Module } from '@nestjs/common'

import { EventBusCoreModule } from './event-bus-core.module'
import { EventBusModuleAsyncOptions, EventBusModuleOptions } from './types'

@Module({})
export class EventBusModule {
  static forRoot(options?: EventBusModuleOptions): DynamicModule {
    return {
      module: EventBusModule,
      imports: [EventBusCoreModule.forRoot(options)],
    }
  }

  static forRootAsync(options: EventBusModuleAsyncOptions): DynamicModule {
    return {
      module: EventBusModule,
      imports: [EventBusCoreModule.forRootAsync(options)],
    }
  }
}
