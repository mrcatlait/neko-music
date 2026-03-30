import {
  computed,
  DestroyRef,
  Directive,
  DOCUMENT,
  ElementRef,
  EmbeddedViewRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core'
import { filter, fromEvent, Subscription } from 'rxjs'

import { Portal, TemplatePortal } from '../portal'
import { AutocompleteContext } from './autocomplete-context'

@Directive({
  selector: '[nAutocompleteTrigger]',
  exportAs: 'nAutocompleteTrigger',
  host: {
    '(focusin)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(autocomplete-option-selected)': 'onOptionSelected($event)',
  },
})
export class AutocompleteTrigger {
  private readonly portal = inject(Portal)
  private readonly host = inject<ElementRef<HTMLInputElement>>(ElementRef)
  private readonly destroyRef = inject(DestroyRef)
  private readonly document = inject(DOCUMENT)

  template = input.required<TemplateRef<HTMLElement>>({ alias: 'nAutocompleteTrigger' })
  readonly optionSelected = output<unknown>()

  private readonly autocompleteRef = signal<EmbeddedViewRef<HTMLElement> | null>(null)
  readonly panelOpen = computed(() => this.autocompleteRef() !== null)
  private scrollSubscription: Subscription | null = null

  constructor() {
    this.destroyRef.onDestroy(() => this.detachPanel())
  }

  protected toggle(): void {
    const autocompleteRef = this.autocompleteRef()

    if (!autocompleteRef) {
      const context: AutocompleteContext = {
        host: this.host.nativeElement,
      }
      this.autocompleteRef.set(this.portal.addTemplate(new TemplatePortal(this.template()), context))
      this.listenToAncestorScroll()
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
    const hadOpenPanel = this.autocompleteRef() !== null
    this.detachPanel()
    if (hadOpenPanel) {
      this.host.nativeElement.blur()
    }
  }

  /**
   * Removes the overlay without blurring the host.
   */
  private detachPanel(): void {
    const autocompleteRef = this.autocompleteRef()

    if (autocompleteRef) {
      this.portal.removeTemplate(autocompleteRef)
      this.autocompleteRef.set(null)
      this.scrollSubscription?.unsubscribe()
      this.scrollSubscription = null
    }
  }

  protected onOptionSelected(event: unknown): void {
    this.optionSelected.emit((event as CustomEvent).detail.value)
    this.host.nativeElement.blur()
  }

  private listenToAncestorScroll(): void {
    this.scrollSubscription = fromEvent(this.document, 'scroll', { passive: true, capture: true })
      .pipe(
        filter((event) => {
          const target = event.target as Node
          return !!(this.host.nativeElement.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINS)
        }),
      )
      .subscribe(() => this.close())

    this.destroyRef.onDestroy(() => this.scrollSubscription?.unsubscribe())
  }
}
