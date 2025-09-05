import { ChangeDetectionStrategy, Component, computed, ElementRef, inject } from '@angular/core'

import { PORTAL_CONTEXT } from '../portal'
import { MenuContext } from './menu-context'

import { VIEWPORT } from '@/core/injectors'

@Component({
  selector: 'n-menu',
  template: `
    <div
      class="menu"
      [style.left.px]="styles().left"
      [style.top.px]="styles().top"
    >
      <ng-content />
    </div>
  `,
  styles: `
    @use 'abstracts' as abstracts;

    .menu {
      position: fixed;
      display: flex;
      background-color: var(--color-surface-container-high);
      color: var(--color-text-high-emphasis);
      border-radius: var(--shape-corner-extra-small);
      min-width: 112px;
      max-width: 280px;

      @include abstracts.elevation(4);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  private readonly menuRef = inject(ElementRef)
  private readonly viewport = inject(VIEWPORT)
  private readonly context = inject<MenuContext>(PORTAL_CONTEXT)

  protected readonly styles = computed(() => this.getStyles())

  private getStyles(): { top: number; left: number } {
    const { width, height } = this.menuRef.nativeElement.getBoundingClientRect()
    const hostRect = this.safeHost.getBoundingClientRect()
    const viewportRect = this.viewport.getClientRect()

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

  private get safeHost(): HTMLElement {
    if (!this.context.host) {
      throw new Error('Host not initialized')
    }

    return this.context.host
  }
}
