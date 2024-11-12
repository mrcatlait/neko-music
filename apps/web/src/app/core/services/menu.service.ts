import { EmbeddedViewRef, inject, Injectable, TemplateRef } from '@angular/core'
import { DOCUMENT } from '@angular/common'

import { PortalService } from './portal.service'

import { WINDOW } from '@core/tokens/window.token'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly document = inject(DOCUMENT)
  private readonly window = inject(WINDOW)
  private readonly portalService = inject(PortalService)

  private menuRef: EmbeddedViewRef<HTMLElement> | null = null
  private host: HTMLElement | null = null

  open(host: HTMLElement, template: TemplateRef<HTMLElement>): void {
    this.close()

    this.host = host
    this.menuRef = this.portalService.addTemplate(template)

    this.addEventListener()

    const observer = new MutationObserver((_mutations, obs) => {
      const [y, x] = this.getPosition()

      this.safeDropdownContent.style.left = `${x}px`
      this.safeDropdownContent.style.top = `${y}px`

      obs.disconnect()
    })

    observer.observe(this.safeDropdownContent, { childList: true, subtree: true })
  }

  close(): void {
    if (this.menuRef) {
      this.portalService.removeTemplate(this.menuRef)
      this.menuRef = null
      this.host = null
    }

    this.removeEventListener()
  }

  private addEventListener(): void {
    this.document.addEventListener('keydown', this.escapePressedListener)
    this.document.addEventListener('click', this.clickOutsideListener)
  }

  private removeEventListener(): void {
    this.document.removeEventListener('keydown', this.escapePressedListener)
    this.document.removeEventListener('click', this.clickOutsideListener)
  }

  private readonly escapePressedListener = (event: KeyboardEvent): void => {
    if (event.code === 'Escape') {
      this.close()
    }
  }

  private readonly clickOutsideListener = (event: MouseEvent): void => {
    // const withinBoundaries = event.composedPath().includes(this.safeDropdownContent)
    const isHostClick = this.host && event.composedPath().includes(this.host)

    // if (!withinBoundaries && !isHostClick) {
    //   this.close()
    // }

    if (!isHostClick) {
      this.close()
    }
  }

  private getPosition(): Readonly<[number, number]> {
    if (!this.host) {
      throw new Error('Host not initialized')
    }

    const { width, height } = this.safeDropdownContent.getBoundingClientRect()

    const hostRect = this.host.getBoundingClientRect()

    const viewportRect = this.getViewportRect()

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
      return [position[previous], position[align]]
    }

    previous = better

    return [position[better], position[align]]
  }

  private getViewportRect(): DOMRect {
    const rect = {
      top: 0,
      left: 0,
      right: this.window.innerWidth,
      bottom: this.window.innerHeight,
      width: this.window.innerWidth,
      height: this.window.innerHeight,
      x: 0,
      y: 0,
    }

    return {
      ...rect,
      toJSON: () => JSON.stringify(rect),
    }
  }

  private get safeDropdownContent(): HTMLElement {
    if (!this.menuRef) {
      throw new Error('Dropdown not initialized')
    }

    return this.menuRef.rootNodes[0]
  }
}
