import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core'

import { PORTAL_CONTEXT, PortalPosition } from '../portal'
import { MenuContext } from './menu-context'

import { VIEWPORT } from '@/core/injectors'

type Directions = 'top' | 'bottom'
type Aligns = 'left' | 'right' | 'center'

@Component({
  selector: 'n-menu',
  template: ` <ng-content /> `,
  styles: `
    @use 'abstracts' as abstracts;

    n-menu {
      --n-menu-background-color: var(--color-surface-container-high);
      --n-menu-color: var(--color-text-high-emphasis);
      --n-menu-border-radius: var(--shape-corner-extra-small);
      --n-menu-min-width: 112px;
      --n-menu-max-width: 280px;
      --n-menu-padding: 4px 0;

      position: fixed;
      display: flex;
      flex-direction: column;
      background-color: var(--n-menu-background-color);
      color: var(--n-menu-color);
      border-radius: var(--n-menu-border-radius);
      min-width: var(--n-menu-min-width);
      max-width: var(--n-menu-max-width);
      padding: var(--n-menu-padding);

      @include abstracts.elevation(4);
    }
  `,
  host: {
    '[style.left.px]': 'styles().left',
    '[style.top.px]': 'styles().top',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  private readonly menuRef = inject(ElementRef)
  private readonly portalPosition = inject(PortalPosition)
  private readonly context = inject<MenuContext>(PORTAL_CONTEXT)

  direction = input<Directions>('bottom')
  align = input<Aligns>('right')

  protected readonly styles = computed(() => this.getStyles())

  private getStyles(): { top: number; left: number } {
    const { width, height } = this.menuRef.nativeElement.getBoundingClientRect()

    return this.portalPosition.getPosition({
      direction: this.direction(),
      align: this.align(),
      width,
      height,
      hostElement: this.safeHost,
    })
  }

  private get safeHost(): HTMLElement {
    if (!this.context.host) {
      throw new Error('Host not initialized')
    }

    return this.context.host
  }
}
