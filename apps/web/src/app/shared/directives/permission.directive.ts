import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core'

import { Permission } from '@core/enum'
import { PermissionService } from '@core/services/permission.service'

@Directive({
  selector: '[nekoPermission]',
})
export class PermissionDirective implements OnInit {
  @Input('nekoPermission') permission: Permission | Permission[] | undefined
  @Input('nekoPermissionStrategy') strategy: 'any' | 'all' = 'any'

  private isVisible = false

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly permissionService: PermissionService,
  ) {}

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
    }

    if (hasPermission && !this.isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef)
      this.isVisible = true
    } else if (!hasPermission && this.isVisible) {
      this.viewContainer.clear()
      this.isVisible = false
    }
  }
}
