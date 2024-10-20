import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Permission } from '@neko/permissions'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  imports: [RouterLinkActive, RouterLink, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  readonly permissions = Permission
}
