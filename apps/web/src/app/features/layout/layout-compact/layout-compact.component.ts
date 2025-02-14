import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { NavigationBarComponent } from '../layout-shared/components'

import { PlayerComponent } from '@features/player'

@Component({
  selector: 'neko-layout-compact',
  imports: [NavigationBarComponent, PlayerComponent, RouterOutlet],
  template: `
    <main>
      <router-outlet />
    </main>

    <neko-player />

    <neko-navigation-bar />
  `,
  styleUrl: './layout-compact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutCompactComponent {}
