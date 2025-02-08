import { Injectable, Signal } from '@angular/core'
import { fromEvent, map, startWith } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'

import { Screens } from '../constants'
import { ValueOf } from '../types'
import { injectWindow } from '../providers'

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService {
  private readonly window = injectWindow()
  private readonly activeMediaQueries = new Map<ValueOf<typeof Screens>, Signal<boolean>>()

  readonly isCompactScreen = this.screen(Screens.Compact)
  readonly isMediumScreen = this.screen(Screens.Medium)
  readonly isExpandedScreen = this.screen(Screens.Expanded)
  readonly isLargeScreen = this.screen(Screens.Large)
  readonly isXLargeScreen = this.screen(Screens.XLarge)

  private screen(screen: ValueOf<typeof Screens>): Signal<boolean> {
    if (this.activeMediaQueries.has(screen)) {
      return this.activeMediaQueries.get(screen)!
    }

    const mediaQuery = this.window.matchMedia(screen)

    const dynamicMediaQuery = fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
      startWith(mediaQuery),
      map((query: MediaQueryList) => query.matches),
    )

    const signalQuery = toSignal(dynamicMediaQuery, { initialValue: mediaQuery.matches })

    this.activeMediaQueries.set(screen, signalQuery)

    return signalQuery
  }
}
