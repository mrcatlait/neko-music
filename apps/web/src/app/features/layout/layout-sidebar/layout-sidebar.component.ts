import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'

import { MediaQueryService } from '@core/services'

@Component({
  selector: 'neko-layout-sidebar',
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
