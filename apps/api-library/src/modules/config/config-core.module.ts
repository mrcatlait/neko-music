import { Module } from '@nestjs/common'

import { ConfigService } from './services'
import { CONFIG_MODULE_OPTIONS } from './tokens'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class ConfigCoreModule extends CoreModuleWithOptions {
  static module = ConfigCoreModule
  static optionsToken = CONFIG_MODULE_OPTIONS
  static providers = [ConfigService]
  static exports = [ConfigService]
}
