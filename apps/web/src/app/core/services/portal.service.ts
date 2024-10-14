import {
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
  INJECTOR,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private readonly injector = inject(INJECTOR)

  private vcr?: ViewContainerRef

  attach(vcr: ViewContainerRef): void {
    this.vcr = vcr
  }

  add<C>(component: Type<C>): ComponentRef<C> {
    const injector = this.createInjector()
    const ref = this.safeHost.createComponent(component, { injector })

    ref.changeDetectorRef.detectChanges()

    return ref
  }

  remove<C>({ hostView }: ComponentRef<C>): void {
    if (!hostView.destroyed) {
      hostView.destroy()
    }
  }

  addTemplate<C>(templateRef: TemplateRef<C>, context?: C): EmbeddedViewRef<C> {
    return this.safeHost.createEmbeddedView(templateRef, context)
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

  private createInjector(): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [], // @todo provide token with id
    })
  }
}
