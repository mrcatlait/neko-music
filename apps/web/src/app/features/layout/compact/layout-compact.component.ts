import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavigationBarComponent } from '../shared/components'

@Component({
  selector: 'neko-layout-compact',
  imports: [NavigationBarComponent, RouterOutlet],
  template: `
    <main>
      <router-outlet />
    </main>

    <!-- <neko-player /> -->

    <neko-navigation-bar />
  `,
  styleUrl: './layout-compact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutCompactComponent {}
