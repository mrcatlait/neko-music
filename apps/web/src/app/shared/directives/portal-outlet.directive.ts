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

import { PortalComponent } from '@core/classes'

@Directive({
  selector: '[portalOutlet]',
  standalone: false,
})
export class PortalOutletDirective<C> implements OnInit {
  private readonly vcr = inject(ViewContainerRef)
  private readonly injector = inject(INJECTOR)
  private c?: ComponentRef<unknown>

  @Input({ required: true, alias: 'portalOutlet' }) component: PortalComponent<unknown>
  @Input({ alias: 'portalOutletContext' }) context?: C

  ngOnInit(): void {
    this.c?.injector.get(ChangeDetectorRef).markForCheck()

    if (!this.component) {
      return
    }

    this.vcr.clear()

    this.createComponent(this.component, this.context)
  }

  private createComponent(component: PortalComponent<unknown>, context?: C): void {
    const injector = component.createInjector(this.injector, context)
    this.c = this.vcr.createComponent(component.component, { injector })
  }
}
