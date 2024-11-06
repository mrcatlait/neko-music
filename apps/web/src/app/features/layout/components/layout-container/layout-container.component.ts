import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'

import { LayoutService } from '../../services'

import { Layout } from '@core/enum'
import { MediaQueryService } from '@core/services'

@Component({
  selector: 'neko-layout-container',
  templateUrl: './layout-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutContainerComponent {
  private readonly mediaQueryService = inject(MediaQueryService)
  private readonly layoutService = inject(LayoutService)

  private readonly isMediumScreen = this.mediaQueryService.isMediumScreen
  private readonly isExpandedScreen = this.mediaQueryService.isExpandedScreen
  private readonly expanded = signal(false)

  readonly expandedSidebar = computed(() => (this.isMediumScreen() || this.isExpandedScreen()) && this.expanded())

  readonly layout = this.layoutService.layout
  Layout = Layout

  handleExpand() {
    this.expanded.set(true)
  }

  handleCollapse() {
    this.expanded.set(false)
  }
}
