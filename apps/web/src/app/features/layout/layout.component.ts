import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { LayoutService } from './services'
import { LayoutSidebarComponent } from './layout-sidebar/layout-sidebar.component'
import { LayoutMinimalComponent } from './layout-minimal/layout-minimal.component'
import { LayoutDialogsComponent } from './layout-dialogs/layout-dialogs.component'

import { Layout } from '@core/enums'

@Component({
  selector: 'neko-layout',
  imports: [LayoutSidebarComponent, LayoutMinimalComponent, LayoutDialogsComponent],
  providers: [LayoutService],
  templateUrl: 'layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly layoutService = inject(LayoutService)

  readonly layout = this.layoutService.layout
  Layout = Layout
}
