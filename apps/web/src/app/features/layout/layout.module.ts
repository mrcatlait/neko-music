import { NgModule } from '@angular/core'

import { LayoutService } from './services'
import { LayoutMinimalModule } from './layout-minimal/layout-minimal.module'
import { LayoutComponent } from './layout.component'
import { LayoutSidebarModule } from './layout-sidebar/layout-sidebar.module'

import { SharedModule } from '@shared/shared.module'
import { PlayerModule } from '@features/player'

@NgModule({
  imports: [LayoutMinimalModule, LayoutSidebarModule, PlayerModule, SharedModule],
  providers: [LayoutService],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutModule {}
