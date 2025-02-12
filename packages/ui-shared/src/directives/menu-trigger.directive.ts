import { Directive, Input, inject, TemplateRef, ElementRef, HostListener } from '@angular/core'

import { MenuService } from '../services'

@Directive({
  selector: '[nekoMenuTrigger]',
})
export class MenuTriggerDirective {
  private readonly menuService = inject(MenuService)

  private readonly el = inject(ElementRef).nativeElement

  @Input({ required: true })
  nekoMenuTrigger: TemplateRef<HTMLElement>

  @HostListener('click')
  handleClick(): void {
    this.menuService.open(this.el, this.nekoMenuTrigger)
  }
}
