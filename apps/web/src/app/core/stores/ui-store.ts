import { inject, Injectable, signal } from '@angular/core'

import { WINDOW } from '@/core/providers'

@Injectable({
  providedIn: 'root',
})
export class UiStore {
  private readonly window = inject(WINDOW)

  readonly touchDevice = signal(false)

  constructor() {
    this.detectTouchDevice()
  }

  private detectTouchDevice(): void {
    const userAgent = this.window.navigator.userAgent
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const hasTouch = 'ontouchstart' in this.window || this.window.navigator.maxTouchPoints > 0
    const hasHover = this.window.matchMedia('(hover: hover)').matches
    const smallScreen = this.window.innerWidth < 768
    const hasCoarsePointer = this.window.matchMedia('(pointer: coarse)').matches

    const isTouchDevice = isMobileUA || (hasTouch && smallScreen && !hasHover) || hasCoarsePointer

    this.touchDevice.set(isTouchDevice)
  }
}
