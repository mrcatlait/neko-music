import { NgIf } from '@angular/common'
import { Directive, Input, OnInit, inject } from '@angular/core'
import { Permission } from '@neko/permissions'

import { AuthState } from '@core/state'

@Directive({
  selector: '[hasPermissions]',
  hostDirectives: [NgIf],
})
export class PermissionDirective implements OnInit {
  private readonly ngIfDirective = inject(NgIf)
  private readonly authState = inject(AuthState)

  @Input('hasPermissions') permission: Permission | Permission[]
  @Input('hasPermissionsStrategy') strategy: 'any' | 'all' = 'any'

  ngOnInit() {
    this.updateView()
  }

  private updateView() {
    let hasPermission = false

    if (this.permission) {
      if (Array.isArray(this.permission)) {
        hasPermission =
          this.strategy === 'any'
            ? this.authState.hasAnyPermission(this.permission)
            : this.authState.hasAllPermissions(this.permission)
      } else {
        hasPermission = this.authState.hasPermission(this.permission)
      }

      this.ngIfDirective.ngIf = hasPermission
    }
  }
}
