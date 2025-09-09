import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core'

import { AutocompleteContext } from './autocomplete-context'
import { PORTAL_CONTEXT } from '../portal'

@Component({
  selector: 'n-autocomplete-option',
  template: ` <ng-content /> `,
  styles: `
    @use 'abstracts' as abstracts;

    n-autocomplete-option {
      --n-autocomplete-option-height: 48px;
      --n-autocomplete-option-padding: 0 12px;
      --n-autocomplete-option-color: var(--color-on-surface);

      cursor: pointer;
      height: var(--n-autocomplete-option-height);
      display: flex;
      gap: 12px;
      align-items: center;
      color: var(--n-autocomplete-option-color);
      padding: var(--n-autocomplete-option-padding);

      @include abstracts.typography(label-large);
      @include abstracts.state(var(--n-autocomplete-option-color));

      &[disabled] {
        cursor: default;
        --n-autocomplete-option-color: var(--color-text-disabled);
      }
    }
  `,
  host: {
    '(mousedown)': 'onMouseDown($event)',
    '(click)': 'onClick($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteOption {
  private readonly context = inject<AutocompleteContext>(PORTAL_CONTEXT)

  value = input<string | number>()

  protected onMouseDown(event: Event): void {
    event.preventDefault()
  }

  protected onClick(event: Event): void {
    const customEvent = new CustomEvent('autocomplete-option-selected', {
      detail: {
        value: this.value(),
      },
      bubbles: true,
      cancelable: true,
    })

    this.context.host.dispatchEvent(customEvent)
    event.stopPropagation()
  }
}
