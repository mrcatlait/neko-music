import { BaseContainer } from './base'
import { ConfigService, CryptoService } from './services'

export class CoreContainer extends BaseContainer {
  static getConfigService(): ConfigService {
    return this.getInstance(ConfigService, () => new ConfigService())
  }

  static getCryptoService(): CryptoService {
    return this.getInstance(CryptoService, () => new CryptoService(this.getConfigService()))
  }
}
