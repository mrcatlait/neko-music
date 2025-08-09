import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

import { EVENT_BUS_MODULE_OPTIONS } from './tokens'
import { EventBusService } from './services'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class EventBusCoreModule extends CoreModuleWithOptions {
  static module = EventBusCoreModule
  static optionsToken = EVENT_BUS_MODULE_OPTIONS
  static imports = [DiscoveryModule]
  static providers = [EventBusService]
  static exports = [EventBusService]
}
