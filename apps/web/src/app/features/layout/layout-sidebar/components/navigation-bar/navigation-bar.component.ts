import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Permission } from '@neko/permissions'

@Component({
  selector: 'neko-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  readonly permissions = Permission
}
