import { NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import {
  NavigationBarComponent,
  NavigationDrawerComponent,
  NavigationModalDrawerComponent,
  NavigationRailComponent,
} from './components'

import { MediaQueryService } from '@core/services'
import { SelectorDirective } from '@shared/directives'
import { PlayerComponent } from '@features/player/components'

@Component({
  selector: 'neko-layout-sidebar',
  templateUrl: 'layout-sidebar.component.html',
  styleUrl: 'layout-sidebar.component.scss',
  imports: [
    SelectorDirective,
    NgIf,
    NavigationRailComponent,
    NavigationModalDrawerComponent,
    NavigationDrawerComponent,
    NavigationBarComponent,
    PlayerComponent,
    RouterOutlet,
  ],
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
