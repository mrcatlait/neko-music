import { ModuleRef } from '@nestjs/core'

/**
 * A strategy that supports dependency injection.
 */
export interface InjectableStrategy {
  onInit?: (moduleRef: ModuleRef) => void
  onDestroy?: () => void
}
