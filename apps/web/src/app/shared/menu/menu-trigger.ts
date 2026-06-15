import {
  computed,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core'

import { Portal, TemplatePortal } from '../portal'
import { MenuContext } from './menu-context'

@Directive({
  selector: '[nMenuTrigger]',
  exportAs: 'nMenuTrigger',
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
  readonly openChange = output<boolean>({ alias: 'nMenuOpenChange' })

  private readonly menuRef = signal<EmbeddedViewRef<HTMLElement> | null>(null)

  toggle(): void {
    const menuRef = this.menuRef()

    if (!menuRef) {
      const context: MenuContext = { host: this.host.nativeElement as HTMLElement }
      this.menuRef.set(this.portal.addTemplate(new TemplatePortal(this.template()), context))
      this.openChange.emit(true)
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
      this.openChange.emit(false)
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
