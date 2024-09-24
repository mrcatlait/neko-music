import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-navigation-rail',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  imports: [RouterLinkActive, RouterLink, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  @Output() expand = new EventEmitter<void>()
}
