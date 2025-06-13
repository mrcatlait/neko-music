import { browser } from '$app/environment'

const BLUR_ON_CLICK_ATTRIBUTE = 'data-blur-on-click'

if (browser) {
  document.addEventListener(
    'click',
    (event: Event) => {
      const target = event.target as HTMLElement
      if (target.hasAttribute(BLUR_ON_CLICK_ATTRIBUTE)) {
        requestAnimationFrame(() => target.blur())
      }
    },
    { capture: true, passive: true },
  )
}

export const blurOnClick = (element: HTMLElement) => {
  element.setAttribute(BLUR_ON_CLICK_ATTRIBUTE, '')

  return {
    destroy() {
      element.removeAttribute(BLUR_ON_CLICK_ATTRIBUTE)
    },
  }
}
