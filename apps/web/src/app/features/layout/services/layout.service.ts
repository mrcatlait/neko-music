import { inject, Injectable, signal } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { concat, defer, filter, map, mergeMap, of } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'

import { Layout } from '@core/enum'

@Injectable()
export class LayoutService {
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)

  private readonly layout$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.activatedRoute),
    map((route) => {
      while (route.firstChild) {
        route = route.firstChild
      }
      return route
    }),
    filter((route) => route.outlet === 'primary'),
    mergeMap((route) => route.data),
    map(({ layout }) => (layout as Layout) ?? Layout.DEFAULT),
  )

  readonly layout = toSignal(
    concat(
      defer(() => of(Layout.DEFAULT)),
      this.layout$,
    ),
  )
}
