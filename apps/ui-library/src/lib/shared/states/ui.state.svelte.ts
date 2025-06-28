import { browser } from '$app/environment'

export class UiState {
  touchDevice = $state(false)

  constructor() {
    this.detectTouchDevice()
  }

  private detectTouchDevice(): void {
    if (!browser) return

    const userAgent = navigator.userAgent
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const hasHover = window.matchMedia('(hover: hover)').matches
    const smallScreen = window.innerWidth < 768
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches

    const isTouchDevice = isMobileUA || (hasTouch && smallScreen && !hasHover) || hasCoarsePointer

    this.touchDevice = isTouchDevice
  }
}
