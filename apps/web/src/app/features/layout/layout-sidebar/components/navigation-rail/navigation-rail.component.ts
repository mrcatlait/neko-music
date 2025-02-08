import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Permission } from '@neko/permissions'
import { PermissionDirective } from '@neko/ui-auth'

import { LogoComponent } from '@shared/components'
import { ButtonDirective } from '@neko/ui-shared/directives'

@Component({
  selector: 'neko-navigation-rail',
  imports: [RouterLink, RouterLinkActive, LogoComponent, ButtonDirective, PermissionDirective],
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  @Output() expand = new EventEmitter<void>()

  readonly permissions = Permission
}
