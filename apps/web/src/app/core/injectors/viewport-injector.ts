import { inject, InjectionToken } from '@angular/core'
import { debounceTime, fromEvent, map } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'

import { WINDOW } from './window-injector'

interface Viewport {
  getClientRect(): DOMRect
}

export const VIEWPORT = new InjectionToken<Viewport>('VIEWPORT', {
  factory: () => {
    const win = inject(WINDOW)

    // Create reactive size signal from window resize events
    const size$ = fromEvent(win, 'resize').pipe(
      debounceTime(16), // ~60fps
      map(() => ({
        width: win.innerWidth,
        height: win.innerHeight,
        visualViewport: win.visualViewport,
      })),
    )

    const size = toSignal(size$, {
      initialValue: { width: win.innerWidth, height: win.innerHeight, visualViewport: win.visualViewport },
    })

    return {
      getClientRect(): DOMRect {
        const currentSize = size()
        const { height = 0, offsetTop = 0 } = currentSize.visualViewport || {}

        const rect = {
          top: 0,
          left: 0,
          right: currentSize.width,
          bottom: currentSize.height,
          width: currentSize.width,
          height: height + offsetTop || currentSize.height,
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
