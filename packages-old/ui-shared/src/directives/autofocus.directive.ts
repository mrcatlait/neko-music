import { AfterViewInit, booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core'

@Directive({
  selector: '[nekoAutofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef)

  nekoAutofocus = input(false, { transform: booleanAttribute })

  ngAfterViewInit(): void {
    if (this.nekoAutofocus()) {
      this.elementRef.nativeElement.focus()
    }
  }
}
