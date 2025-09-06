import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  inject,
  INJECTOR,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core'

import { ComponentPortal } from './component-portal'

@Directive({
  selector: '[portalOutlet]',
})
export class PortalOutlet<C> implements OnInit {
  private readonly vcr = inject(ViewContainerRef)
  private readonly injector = inject(INJECTOR)

  private componentRef?: ComponentRef<unknown>

  @Input({ required: true, alias: 'portalOutlet' }) component!: ComponentPortal<unknown>
  @Input({ alias: 'portalOutletContext' }) context?: C

  ngOnInit(): void {
    this.componentRef?.injector.get(ChangeDetectorRef).markForCheck()

    if (!this.component) {
      return
    }

    this.vcr.clear()

    this.createComponent(this.component, this.context)
  }

  private createComponent(component: ComponentPortal<unknown>, context?: C): void {
    const injector = component.createInjector(this.injector, context)
    this.componentRef = this.vcr.createComponent(component.component, { injector })
  }
}
