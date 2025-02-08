import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { MediaQueryService } from '@neko/ui-shared/services'

import {
  NavigationBarComponent,
  NavigationDrawerComponent,
  NavigationModalDrawerComponent,
  NavigationRailComponent,
} from './components'

import { PlayerComponent } from '@features/player'

@Component({
  selector: 'neko-layout-sidebar',
  imports: [
    NavigationBarComponent,
    NavigationDrawerComponent,
    NavigationModalDrawerComponent,
    NavigationRailComponent,
    RouterOutlet,
    PlayerComponent,
  ],
  templateUrl: 'layout-sidebar.component.html',
  styleUrl: 'layout-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutSidebarComponent {
  private readonly mediaQueryService = inject(MediaQueryService)

  private readonly isMediumScreen = this.mediaQueryService.isMediumScreen
  private readonly isExpandedScreen = this.mediaQueryService.isExpandedScreen
  private readonly expanded = signal(false)

  readonly expandedSidebar = computed(() => (this.isMediumScreen() || this.isExpandedScreen()) && this.expanded())

  handleExpand() {
    this.expanded.set(true)
  }

  handleCollapse() {
    this.expanded.set(false)
  }
}
