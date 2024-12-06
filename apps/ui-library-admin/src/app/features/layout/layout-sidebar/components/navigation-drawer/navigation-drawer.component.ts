import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Permission } from '@neko/permissions'

@Component({
  selector: 'neko-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerComponent {
  readonly permissions = Permission
}
