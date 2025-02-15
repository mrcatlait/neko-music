import { Injectable, Signal } from '@angular/core'
import { fromEvent, map, startWith } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'
import { injectWindow } from '@neko/ui-shared/providers'

@Injectable({
  providedIn: 'root',
})
export class BreakpointObserver {
  private readonly window = injectWindow()
  private readonly activeMediaQueries = new Map<string, Signal<boolean>>()

  observe(breakpoint: string): Signal<boolean> {
    if (this.activeMediaQueries.has(breakpoint)) {
      return this.activeMediaQueries.get(breakpoint)!
    }

    const mediaQuery = this.window.matchMedia(breakpoint)

    const dynamicMediaQuery = fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
      startWith(mediaQuery),
      map((query: MediaQueryList) => query.matches),
    )

    const signalQuery = toSignal(dynamicMediaQuery, { initialValue: mediaQuery.matches })

    this.activeMediaQueries.set(breakpoint, signalQuery)

    return signalQuery
  }
}
