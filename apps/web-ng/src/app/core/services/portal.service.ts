import {
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  INJECTOR,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'

import { PortalComponent } from '@core/classes'

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private readonly injector = inject(INJECTOR)

  private vcr?: ViewContainerRef

  attach(vcr: ViewContainerRef): void {
    this.vcr = vcr
  }

  add<Component, Context>(portalComponent: PortalComponent<Component>, context?: Context): ComponentRef<Component> {
    const injector = portalComponent.createInjector(this.injector, context)
    const ref = this.safeHost.createComponent(portalComponent.component, { injector })

    ref.changeDetectorRef.detectChanges()

    return ref
  }

  remove<Component>({ hostView }: ComponentRef<Component>): void {
    if (!hostView.destroyed) {
      hostView.destroy()
    }
  }

  addTemplate<Context>(templateRef: TemplateRef<Context>, context?: Context): EmbeddedViewRef<Context> {
    return this.safeHost.createEmbeddedView(templateRef, context)
  }

  removeTemplate<Context>(viewRef: EmbeddedViewRef<Context>): void {
    if (!viewRef.destroyed) {
      viewRef.destroy()
    }
  }

  protected get safeHost(): ViewContainerRef {
    if (!this.vcr) {
      throw new Error('ViewContainerRef not defined')
    }

    return this.vcr
  }
}
