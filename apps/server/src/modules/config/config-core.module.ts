import { Module } from '@nestjs/common'

import { ConfigService } from './services'
import { CONFIG_MODULE_OPTIONS } from './tokens'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class ConfigCoreModule extends CoreModuleWithOptions {
  static readonly module = ConfigCoreModule
  static readonly optionsToken = CONFIG_MODULE_OPTIONS
  static readonly providers = [ConfigService]
  static readonly exports = [ConfigService]
}
