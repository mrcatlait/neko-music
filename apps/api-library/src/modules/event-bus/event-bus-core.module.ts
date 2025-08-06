import { Module } from '@nestjs/common'

import { EventBusModuleOptions } from './types'
import { EVENT_BUS_MODULE_OPTIONS } from './constants'
import { EventBusService, EventHandlerExplorerService } from './services'
import { ObservableMessagingStrategy } from './strategies/messaging'

import { CoreModuleWithOptions } from '@modules/app/classes'

const defaultEventBusModuleOptions: EventBusModuleOptions = {
  messagingStrategy: new ObservableMessagingStrategy(),
}

@Module({})
export class EventBusCoreModule extends CoreModuleWithOptions<EventBusModuleOptions> {
  module = EventBusCoreModule
  optionsToken = EVENT_BUS_MODULE_OPTIONS
  providers = [EventBusService, EventHandlerExplorerService]
  exports = [EventBusService]
}
