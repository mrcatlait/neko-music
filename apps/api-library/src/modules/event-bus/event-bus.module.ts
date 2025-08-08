import { Global, Module } from '@nestjs/common'

import { EventBusCoreModule } from './event-bus-core.module'
import { EventBusModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/app/classes'
import { AsyncModuleOptions } from '@/modules/app/interfaces'

@Module({})
export class EventBusModule extends ModuleWithOptions {
  static module = EventBusModule
  static coreModule = EventBusCoreModule

  static forRoot(options: EventBusModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<EventBusModuleOptions>) {
    return super.forRootAsync(options)
  }
}
