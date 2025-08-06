import { Module } from '@nestjs/common'

import { EventBusCoreModule } from './event-bus-core.module'
import { EventBusModuleOptions } from './types'

import { ModuleWithOptions } from '@modules/app/classes'

@Module({})
export class EventBusModule extends ModuleWithOptions<EventBusModuleOptions> {
  module = EventBusModule
  coreModule = EventBusCoreModule
}
