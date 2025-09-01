import { inject, InjectionToken, Provider } from '@angular/core'

import { AgGridService } from '../services'

export const AG_GRID_SERVICE = new InjectionToken<AgGridService<unknown>>('AG_GRID_SERVICE')

/**
 * Provides the AgGridService.
 *
 * @example
 * ```typescript
 * ＠Component({
 *  providers: [provideAgGridService(ArtistTableService)]
 * })
 * export class ArtistComponent {}
 * ```
 */
export const provideAgGridService = (agServiceClass: new (...args: any[]) => AgGridService<any>): Provider => ({
  provide: AG_GRID_SERVICE,
  useClass: agServiceClass,
})

/**
 * Injects the AgGridService.
 *
 * @example
 * ```typescript
 * const agGridService = injectAgGridService<ArtistTableService>();
 * ```
 */
export const injectAgGridService = <T extends AgGridService<any>>(): T => inject<T>(AG_GRID_SERVICE)
