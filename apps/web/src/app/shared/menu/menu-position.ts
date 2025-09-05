import { inject, Injectable } from '@angular/core'

import { VIEWPORT } from '@/core/injectors'

@Injectable({ providedIn: 'root' })
export class MenuPosition {
  private readonly viewport = inject(VIEWPORT)

  getPosition(menuElement: HTMLElement, hostElement: HTMLElement): { top: number; left: number } {
    const viewportRect = this.viewport.getClientRect()
    const hostRect = hostElement.getBoundingClientRect()
    const { height, width } = menuElement.getBoundingClientRect()

    const offset = 4
    const minHeight = height ?? 80
    const direction: 'bottom' | 'top' | null = 'bottom'
    const dropdownSidedOffset = 48
    const align: 'left' | 'right' | 'center' = 'right'
    let previous: keyof typeof position = 'bottom'

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
      top: hostRect.top - offset - height,
      bottom: hostRect.bottom + offset,
      right: Math.max(viewport.left, right),
      center:
        hostRect.left + hostRect.width / 2 + width / 2 < viewport.right
          ? hostRect.left + hostRect.width / 2 - width / 2
          : right,
      left: Math.max(viewport.left, left),
    } as const

    const better = available.top > available.bottom ? 'top' : 'bottom'

    if ((available[previous] > minHeight && direction) || available[previous] > height) {
      return {
        top: position[previous],
        left: position[align],
      }
    }

    previous = better

    return {
      top: position[better],
      left: position[align],
    }
  }
}
