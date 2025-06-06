import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { RouterLinkActive, RouterOutlet } from '@angular/router'
import { Permission } from '@neko/permissions'

import { LogoComponent } from '@shared/components'
import { PermissionDirective, SelectorDirective } from '@shared/directives'

@Component({
  selector: 'neko-navigation-rail',
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss',
  imports: [SelectorDirective, PermissionDirective, RouterOutlet, RouterLinkActive, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  @Output() expand = new EventEmitter<void>()

  readonly permissions = Permission
}
