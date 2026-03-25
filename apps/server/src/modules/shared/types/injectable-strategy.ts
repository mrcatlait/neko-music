import { ModuleRef } from '@nestjs/core'

/**
 * A strategy that supports dependency injection.
 */
export interface InjectableStrategy {
  /**
   * Called when the strategy is initialized.
   * @param moduleRef - The module reference
   */
  onInit?: (moduleRef: ModuleRef) => void
  /**
   * Called when the strategy is destroyed.
   */
  onDestroy?: () => void
}
