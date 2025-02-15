import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavigationModalDrawerComponent, NavigationRailComponent } from '../shared/components'

@Component({
  selector: 'neko-layout-medium',
  imports: [NavigationModalDrawerComponent, NavigationRailComponent, RouterOutlet],
  template: `
    @if (expanded()) {
      <neko-navigation-modal-drawer (toggleExpand)="toggleExpand()" />
    } @else {
      <neko-navigation-rail (toggleExpand)="toggleExpand()" />
    }

    <main>
      <router-outlet />
    </main>
  `,
  styleUrl: './layout-medium.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutMediumComponent {
  readonly expanded = signal(false)

  toggleExpand() {
    this.expanded.update((expanded) => !expanded)
  }
}
