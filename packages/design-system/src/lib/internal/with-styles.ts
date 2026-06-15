import { createComponent, DestroyRef, EnvironmentInjector, inject, InjectionToken, type Type } from '@angular/core'

const STYLES_MAP = new InjectionToken<Map<Type<unknown>, ReturnType<typeof createComponent>>>('STYLES_MAP', {
  factory: () => {
    const map = new Map<Type<unknown>, ReturnType<typeof createComponent>>()

    inject(DestroyRef).onDestroy(() => map.forEach((componentRef) => componentRef.destroy()))

    return map
  },
})

export function withStyles(component: Type<unknown>): undefined {
  const map = inject(STYLES_MAP)
  const environmentInjector = inject(EnvironmentInjector)

  if (!map.has(component)) {
    map.set(component, createComponent(component, { environmentInjector }))
  }

  return undefined
}
