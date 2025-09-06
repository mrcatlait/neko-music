import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, ViewEncapsulation } from '@angular/core'

import { AutocompleteContext } from './autocomplete-context'
import { PORTAL_CONTEXT, PortalPosition } from '../portal'

@Component({
  selector: 'n-autocomplete',
  template: ` <ng-content /> `,
  styles: `
    @use 'abstracts' as abstracts;

    n-autocomplete {
      --n-autocomplete-background-color: var(--color-surface-container-high);
      --n-autocomplete-color: var(--color-text-high-emphasis);
      --n-autocomplete-border-radius: var(--shape-corner-extra-small);
      --n-autocomplete-min-width: 112px;
      --n-autocomplete-padding: 4px 0;

      position: fixed;
      display: flex;
      flex-direction: column;
      background-color: var(--n-autocomplete-background-color);
      color: var(--n-autocomplete-color);
      border-radius: var(--n-autocomplete-border-radius);
      min-width: var(--n-autocomplete-min-width);
      padding: var(--n-autocomplete-padding);

      @include abstracts.elevation(4);
    }
  `,
  host: {
    '[style.left.px]': 'styles().left',
    '[style.top.px]': 'styles().top',
    '[style.width.px]': 'styles().width',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete {
  private readonly autocompleteRef = inject(ElementRef)
  private readonly portalPosition = inject(PortalPosition)
  private readonly context = inject<AutocompleteContext>(PORTAL_CONTEXT)

  protected readonly styles = computed(() => this.getStyles())

  private getStyles(): { top: number; left: number; width: number } {
    const { width, height } = this.autocompleteRef.nativeElement.getBoundingClientRect()
    const hostWidth = this.safeHost.getBoundingClientRect().width

    const position = this.portalPosition.getPosition({
      direction: 'bottom',
      align: 'left',
      width,
      height,
      hostElement: this.safeHost,
      offset: 0,
    })

    return {
      ...position,
      width: hostWidth,
    }
  }
  private get safeHost(): HTMLElement {
    if (!this.context.host) {
      throw new Error('Host not initialized')
    }

    return this.context.host
  }
}
