import { inject, InjectionToken } from '@angular/core'

import { WINDOW } from './window-injector'

interface Viewport {
  type: 'viewport'
  getClientRect(): DOMRect
}

export const VIEWPORT = new InjectionToken<Viewport>('VIEWPORT', {
  factory: () => {
    const win = inject(WINDOW)

    return {
      type: 'viewport',
      getClientRect(): DOMRect {
        const { height = 0, offsetTop = 0 } = win.visualViewport || {}
        const rect = {
          top: 0,
          left: 0,
          right: win.innerWidth,
          bottom: win.innerHeight,
          width: win.innerWidth,
          height: height + offsetTop || win.innerHeight,
          x: 0,
          y: 0,
        }

        return {
          ...rect,
          toJSON: () => JSON.stringify(rect),
        }
      },
    }
  },
})
