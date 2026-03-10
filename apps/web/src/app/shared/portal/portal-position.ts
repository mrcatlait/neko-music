import { inject, Injectable } from '@angular/core'

import { VIEWPORT } from '@/core/injectors'

type Directions = 'top' | 'bottom'
type Aligns = 'left' | 'right' | 'center'

interface PortalPositionOptions {
  direction: Directions
  align: Aligns
  width: number
  offset?: number
  height: number
  hostElement: HTMLElement
}

@Injectable({ providedIn: 'root' })
export class PortalPosition {
  private readonly viewport = inject(VIEWPORT)

  getPosition({ direction, align, width, height, hostElement, offset = 4 }: PortalPositionOptions): {
    top: number | null
    bottom: number | null
    left: number
  } {
    const viewportRect = this.viewport.getClientRect()
    const hostRect = hostElement.getBoundingClientRect()

    const minHeight = height ?? 80
    const dropdownSidedOffset = 48
    let previous: 'top' | 'bottom' = 'bottom'

    const viewport = {
      top: viewportRect.top - offset,
      bottom: viewportRect.bottom + offset,
      right: viewportRect.right - offset,
      left: viewportRect.left + offset,
    } as const

    const available = {
      top: hostRect.top - dropdownSidedOffset - viewport.top,
      bottom: viewport.bottom - hostRect.bottom - dropdownSidedOffset,
    } as const

    const right = Math.max(hostRect.right - width, offset)
    const left = hostRect.left + width < viewport.right ? hostRect.left : right
    const position = {
      top: { top: null, bottom: viewportRect.bottom - hostRect.top + offset },
      bottom: { top: hostRect.bottom + offset, bottom: null },
      right: Math.max(viewport.left, right),
      center:
        hostRect.left + hostRect.width / 2 + width / 2 < viewport.right
          ? hostRect.left + hostRect.width / 2 - width / 2
          : right,
      left: Math.max(viewport.left, left),
    } as const

    const better = available.top > available.bottom ? 'top' : 'bottom'

    if ((available[previous] > minHeight && direction) || available[previous] > height) {
      return { ...position[previous], left: position[align] }
    }

    previous = better

    return { ...position[better], left: position[align] }
  }
}
