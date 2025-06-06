import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet, RouterLinkActive } from '@angular/router'
import { Permission } from '@neko/permissions'

import { LogoComponent } from '@shared/components'
import { PermissionDirective, SelectorDirective } from '@shared/directives'

@Component({
  selector: 'neko-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  imports: [SelectorDirective, PermissionDirective, RouterOutlet, RouterLinkActive, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerComponent {
  readonly permissions = Permission
}
