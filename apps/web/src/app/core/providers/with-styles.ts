import { createComponent, DestroyRef, EnvironmentInjector, inject, InjectionToken, type Type } from '@angular/core'

const MAP = new InjectionToken('STYLES_MAP', {
  factory: () => {
    const map = new Map()

    inject(DestroyRef).onDestroy(() => map.forEach((component) => component.destroy()))

    return map
  },
})

export function withStyles(component: Type<unknown>): undefined {
  const map = inject(MAP)
  const environmentInjector = inject(EnvironmentInjector)

  if (!map.has(component)) {
    console.log('createComponent', component)
    map.set(component, createComponent(component, { environmentInjector }))
  }

  return undefined
}
