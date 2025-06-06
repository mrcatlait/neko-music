import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { LayoutService } from './services'
import { LayoutDialogsComponent } from './layout-dialogs'
import { LayoutMinimalComponent } from './layout-minimal/layout-minimal.component'
import { LayoutSidebarComponent } from './layout-sidebar/layout-sidebar.component'

import { Layout } from '@core/enum'
import { PermissionDirective } from '@shared/directives'

@Component({
  selector: 'neko-layout',
  templateUrl: 'layout.component.html',
  imports: [LayoutSidebarComponent, LayoutMinimalComponent, LayoutDialogsComponent, PermissionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly layoutService = inject(LayoutService)

  readonly layout = this.layoutService.layout
  Layout = Layout
}
