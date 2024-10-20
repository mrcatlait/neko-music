import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Permission } from '@neko/permissions'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  imports: [RouterLinkActive, RouterLink, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerComponent {
  readonly permissions = Permission
}
