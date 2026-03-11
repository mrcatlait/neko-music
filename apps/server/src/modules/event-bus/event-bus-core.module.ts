import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

import { EVENT_BUS_MODULE_OPTIONS } from './tokens'
import { EventBusService } from './services'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class EventBusCoreModule extends CoreModuleWithOptions {
  static readonly module = EventBusCoreModule
  static readonly optionsToken = EVENT_BUS_MODULE_OPTIONS
  static readonly imports = [DiscoveryModule]
  static readonly providers = [EventBusService]
  static readonly exports = [EventBusService]
}
