import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { Permission } from '@neko/permissions'

@Component({
  selector: 'neko-navigation-rail',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  @Output() expand = new EventEmitter<void>()

  readonly permissions = Permission
}
