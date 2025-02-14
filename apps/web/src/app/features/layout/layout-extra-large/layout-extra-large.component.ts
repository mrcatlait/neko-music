import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavigationDrawerComponent, NavigationRailComponent } from '../layout-shared/components'

import { PlayerComponent } from '@features/player'

@Component({
  selector: 'neko-layout-extra-large',
  imports: [NavigationDrawerComponent, NavigationRailComponent, PlayerComponent, RouterOutlet],
  template: `
    @if (expanded()) {
      <neko-navigation-drawer (collapse)="toggleExpanded()" />
    } @else {
      <neko-navigation-rail (expand)="toggleExpanded()" />
    }

    <main>
      <router-outlet />
    </main>

    <neko-player />
  `,
  styleUrl: './layout-extra-large.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutExtraLargeComponent {
  readonly expanded = signal(true)

  toggleExpanded() {
    this.expanded.update((expanded) => !expanded)
  }
}
