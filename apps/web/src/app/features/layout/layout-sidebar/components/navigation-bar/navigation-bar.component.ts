import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Permission } from '@neko/permissions'
import { PermissionDirective } from '@neko/ui-auth'

@Component({
  selector: 'neko-navigation-bar',
  imports: [RouterLink, RouterLinkActive, PermissionDirective],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  readonly permissions = Permission
}
