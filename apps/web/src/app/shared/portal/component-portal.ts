import { Injector, Type } from '@angular/core'

import { PORTAL_CONTEXT } from './portal-context-injector'

export class ComponentPortal<T> {
  constructor(
    readonly component: Type<T>,
    private readonly i?: Injector,
  ) {}

  createInjector<C>(injector: Injector, useValue?: C): Injector {
    return Injector.create({
      parent: this.i || injector,
      providers: [
        {
          provide: PORTAL_CONTEXT,
          useValue,
        },
      ],
    })
  }
}
