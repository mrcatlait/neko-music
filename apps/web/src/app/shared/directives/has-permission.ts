import { NgIf } from '@angular/common'
import { Directive, effect, inject, input } from '@angular/core'

import { AuthStore } from '@/core/stores'

@Directive({
  selector: '[hasPermissions]',
  hostDirectives: [NgIf],
})
export class HasPermission {
  private readonly ngIfDirective = inject(NgIf)
  private readonly authStore = inject(AuthStore)

  permission = input<string | string[]>([], { alias: 'hasPermissions' })
  strategy = input<'any' | 'all'>('any', { alias: 'hasPermissionsStrategy' })

  constructor() {
    effect(() => (this.ngIfDirective.ngIf = this.hasPermissions()))
  }

  private hasPermissions() {
    const permission = this.permission()

    if (Array.isArray(permission)) {
      return this.strategy() === 'any'
        ? this.authStore.hasAnyPermission(permission)
        : this.authStore.hasAllPermissions(permission)
    } else {
      return this.authStore.hasPermission(permission)
    }
  }
}
