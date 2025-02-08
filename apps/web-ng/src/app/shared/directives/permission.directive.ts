import { NgIf } from '@angular/common'
import { Directive, effect, inject, input } from '@angular/core'
import { Permission } from '@neko/permissions'

import { AuthState } from '@core/state'

@Directive({
  selector: '[hasPermissions]',
  hostDirectives: [NgIf],
})
export class PermissionDirective {
  private readonly ngIfDirective = inject(NgIf)
  private readonly authState = inject(AuthState)

  permission = input<Permission | Permission[]>([], { alias: 'hasPermissions' })
  strategy = input<'any' | 'all'>('any', { alias: 'hasPermissionsStrategy' })

  constructor() {
    effect(() => (this.ngIfDirective.ngIf = this.hasPermissions()))
  }

  private hasPermissions() {
    const permission = this.permission()

    if (Array.isArray(permission)) {
      return this.strategy() === 'any'
        ? this.authState.hasAnyPermission(permission)
        : this.authState.hasAllPermissions(permission)
    } else {
      return this.authState.hasPermission(permission)
    }
  }
}
