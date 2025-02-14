import { computed, inject, Injectable } from '@angular/core'

import { BreakpointObserver } from './breakpoint-observer'
import { Breakpoints } from '../constants'
import { WindowClass } from '../enums'

@Injectable({
  providedIn: 'root',
})
export class WindowClassDetector {
  private readonly breakpointObserver = inject(BreakpointObserver)

  private readonly compact = this.breakpointObserver.observe(Breakpoints.Compact)
  private readonly medium = this.breakpointObserver.observe(Breakpoints.Medium)
  private readonly expanded = this.breakpointObserver.observe(Breakpoints.Expanded)
  private readonly large = this.breakpointObserver.observe(Breakpoints.Large)
  private readonly extraLarge = this.breakpointObserver.observe(Breakpoints.ExtraLarge)

  readonly windowClass = computed(() => {
    switch (true) {
      case this.compact():
        return WindowClass.Compact
      case this.medium():
        return WindowClass.Medium
      case this.expanded():
        return WindowClass.Expanded
      case this.large():
        return WindowClass.Large
      case this.extraLarge():
        return WindowClass.ExtraLarge
      default:
        return WindowClass.Large
    }
  })
}
