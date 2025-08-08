import { ModuleRef } from '@nestjs/core'

export interface InjectableStrategy {
  onInit?: (moduleRef: ModuleRef) => void
  onDestroy?: () => void
}
