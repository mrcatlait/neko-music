import { NgModule } from '@angular/core'

import {
  LayoutContainerComponent,
  NavigationBarComponent,
  NavigationDrawerComponent,
  NavigationModalDrawerComponent,
  NavigationRailComponent,
} from './components'
import { LayoutService } from './services'

import { SharedModule } from '@shared/shared.module'
import { PlayerModule } from '@features/player'

@NgModule({
  imports: [PlayerModule, SharedModule],
  providers: [LayoutService],
  declarations: [
    LayoutContainerComponent,
    NavigationBarComponent,
    NavigationDrawerComponent,
    NavigationModalDrawerComponent,
    NavigationRailComponent,
  ],
  exports: [LayoutContainerComponent],
})
export class LayoutModule {}
