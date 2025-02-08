import { NgModule } from '@angular/core'

import { LayoutSidebarComponent } from './layout-sidebar.component'
import {
  NavigationBarComponent,
  NavigationDrawerComponent,
  NavigationModalDrawerComponent,
  NavigationRailComponent,
} from './components'

import { PlayerModule } from '@features/player'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  imports: [PlayerModule, SharedModule],
  declarations: [
    LayoutSidebarComponent,
    NavigationBarComponent,
    NavigationDrawerComponent,
    NavigationModalDrawerComponent,
    NavigationRailComponent,
  ],
  exports: [LayoutSidebarComponent],
})
export class LayoutSidebarModule {}
