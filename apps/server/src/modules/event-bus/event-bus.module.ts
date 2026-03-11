import { Module } from '@nestjs/common'

import { EventBusCoreModule } from './event-bus-core.module'
import { EventBusModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/interfaces'

@Module({})
export class EventBusModule extends ModuleWithOptions {
  static readonly module = EventBusModule
  static readonly coreModule = EventBusCoreModule

  static forRoot(options: EventBusModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<EventBusModuleOptions>) {
    return super.forRootAsync(options)
  }
}
