import { Directive, ElementRef, EmbeddedViewRef, inject, input, output, signal, TemplateRef } from '@angular/core'

import { Portal, TemplatePortal } from '../portal'
import { AutocompleteContext } from './autocomplete-context'

@Directive({
  selector: '[nAutocompleteTrigger]',
  host: {
    '(focusin)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(autocomplete-option-selected)': 'onOptionSelected($event)',
  },
})
export class AutocompleteTrigger {
  private readonly portal = inject(Portal)
  private readonly host = inject<ElementRef<HTMLInputElement>>(ElementRef)

  template = input.required<TemplateRef<HTMLElement>>({ alias: 'nAutocompleteTrigger' })
  readonly optionSelected = output<unknown>()

  private readonly autocompleteRef = signal<EmbeddedViewRef<HTMLElement> | null>(null)

  protected toggle(): void {
    const autocompleteRef = this.autocompleteRef()

    if (!autocompleteRef) {
      const context: AutocompleteContext = {
        host: this.host.nativeElement,
      }
      this.autocompleteRef.set(this.portal.addTemplate(new TemplatePortal(this.template()), context))
    } else {
      this.close()
    }
  }

  protected onFocus(): void {
    this.toggle()
  }

  protected onBlur(): void {
    this.close()
  }

  protected close(): void {
    const autocompleteRef = this.autocompleteRef()

    if (autocompleteRef) {
      this.portal.removeTemplate(autocompleteRef)
      this.autocompleteRef.set(null)
    }
  }

  protected onOptionSelected(event: unknown): void {
    this.optionSelected.emit((event as CustomEvent).detail.value)
    this.host.nativeElement.blur()
  }
}
