import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavigationModalDrawerComponent, NavigationRailComponent } from '../layout-shared/components'

import { PlayerComponent } from '@features/player'

@Component({
  selector: 'neko-layout-medium',
  imports: [NavigationModalDrawerComponent, NavigationRailComponent, PlayerComponent, RouterOutlet],
  template: `
    @if (expanded()) {
      <neko-navigation-modal-drawer (collapse)="toggleExpanded()" />
    } @else {
      <neko-navigation-rail (expand)="toggleExpanded()" />
    }

    <main>
      <router-outlet />
    </main>

    <neko-player />
  `,
  styleUrl: './layout-medium.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutMediumComponent {
  readonly expanded = signal(false)

  toggleExpanded() {
    this.expanded.update((expanded) => !expanded)
  }
}
