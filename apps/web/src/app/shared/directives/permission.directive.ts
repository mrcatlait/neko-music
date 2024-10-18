import { NgIf } from '@angular/common'
import { Directive, Input, OnInit, inject } from '@angular/core'

import { Permission } from '@core/enum'
import { PermissionService } from '@core/services/permission.service'

@Directive({
  selector: '[hasPermissions]',
  hostDirectives: [NgIf],
})
export class PermissionDirective implements OnInit {
  private readonly ngIfDirective = inject(NgIf)
  private readonly permissionService = inject(PermissionService)

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
            ? this.permissionService.hasAnyPermission(this.permission)
            : this.permissionService.hasAllPermissions(this.permission)
      } else {
        hasPermission = this.permissionService.hasPermission(this.permission)
      }

      this.ngIfDirective.ngIf = hasPermission
    }
  }
}
