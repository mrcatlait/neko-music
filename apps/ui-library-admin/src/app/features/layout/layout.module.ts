import { NgModule } from '@angular/core'

import { LayoutService } from './services'
import { LayoutMinimalModule } from './layout-minimal/layout-minimal.module'
import { LayoutComponent } from './layout.component'
import { LayoutSidebarModule } from './layout-sidebar/layout-sidebar.module'
import { LayoutDialogsComponent } from './layout-dialogs'

import { SharedModule } from '@shared/shared.module'
import { PlayerModule } from '@features/player'

@NgModule({
  imports: [LayoutMinimalModule, LayoutSidebarModule, PlayerModule, SharedModule],
  declarations: [LayoutComponent, LayoutDialogsComponent],
  providers: [LayoutService],
  exports: [LayoutComponent],
})
export class LayoutModule {}
