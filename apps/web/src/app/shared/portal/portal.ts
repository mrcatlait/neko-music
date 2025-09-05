import {
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  INJECTOR,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'

import { ComponentPortal } from './component-portal'
import { TemplatePortal } from './template-portal'

@Injectable({
  providedIn: 'root',
})
export class Portal {
  private readonly injector = inject(INJECTOR)

  private vcr?: ViewContainerRef

  attach(vcr: ViewContainerRef): void {
    this.vcr = vcr
  }

  add<C, Context>(portalComponent: ComponentPortal<C>, context?: Context): ComponentRef<C> {
    const injector = portalComponent.createInjector(this.injector, context)
    const ref = this.safeHost.createComponent(portalComponent.component, { injector })

    ref.changeDetectorRef.detectChanges()

    return ref
  }

  remove<C>({ hostView }: ComponentRef<C>): void {
    this.removeTemplate(hostView as EmbeddedViewRef<C>)
  }

  addTemplate<C>(templatePortal: TemplatePortal<HTMLElement>, context?: C): EmbeddedViewRef<HTMLElement> {
    const injector = templatePortal.createInjector(this.injector, context)
    return this.safeHost.createEmbeddedView(templatePortal.template, undefined, { injector })
  }

  removeTemplate<C>(viewRef: EmbeddedViewRef<C>): void {
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
