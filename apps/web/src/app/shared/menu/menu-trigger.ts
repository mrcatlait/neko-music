import { Directive, ElementRef, EmbeddedViewRef, inject, input, signal, TemplateRef } from '@angular/core'

import { Portal, TemplatePortal } from '../portal'
import { MenuContext } from './menu-context'

@Directive({
  selector: '[nMenuTrigger]',
  host: {
    '(click)': 'toggle()',
    '(document:keydown.escape)': 'close()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class MenuTrigger {
  private readonly portal = inject(Portal)
  private readonly host = inject(ElementRef)

  template = input.required<TemplateRef<HTMLElement>>({ alias: 'nMenuTrigger' })

  private readonly menuRef = signal<EmbeddedViewRef<HTMLElement> | null>(null)

  toggle(): void {
    const menuRef = this.menuRef()

    if (!menuRef) {
      const context: MenuContext = { host: this.host.nativeElement as HTMLElement }
      this.menuRef.set(this.portal.addTemplate(new TemplatePortal(this.template()), context))
    } else {
      this.close()
    }
  }

  protected onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement
    const clickedInside = this.host.nativeElement.contains(target) || this.safeMenuElement?.contains(target)

    if (!clickedInside) {
      this.close()
    }
  }

  protected close(): void {
    const menuRef = this.menuRef()

    if (menuRef) {
      this.portal.removeTemplate(menuRef)
      this.menuRef.set(null)
    }
  }

  private get safeMenuElement(): HTMLElement | null {
    const menuRef = this.menuRef()

    if (!menuRef) {
      return null
    }

    return menuRef.rootNodes[0]
  }
}
