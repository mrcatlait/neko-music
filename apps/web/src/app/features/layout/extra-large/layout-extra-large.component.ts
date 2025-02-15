import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { HeaderComponent, NavigationDrawerComponent } from '../shared/components'

import { PlayerComponent } from '@features/playback/player'

@Component({
  selector: 'neko-layout-extra-large',
  imports: [HeaderComponent, NavigationDrawerComponent, PlayerComponent, RouterOutlet],
  template: `
    <neko-header />

    <neko-navigation-drawer />

    <main>
      <router-outlet />
    </main>

    <neko-player />
  `,
  styleUrl: './layout-extra-large.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutExtraLargeComponent {}
