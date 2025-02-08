import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Permission } from '@neko/permissions'
import { PermissionDirective } from '@neko/ui-auth'

import { LogoComponent } from '@shared/components'

@Component({
  selector: 'neko-navigation-drawer',
  imports: [RouterLink, RouterLinkActive, LogoComponent, PermissionDirective],
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerComponent {
  readonly permissions = Permission
}
