import { NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import {
  NavigationBarComponent,
  NavigationDrawerComponent,
  NavigationModalDrawerComponent,
  NavigationRailComponent,
} from './layout'

import { CoreModule } from '@core/core.module'
import { SharedModule } from '@shared/shared.module'
import { PlayerModule } from '@features/player'

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    CoreModule,
    NavigationBarComponent,
    NavigationDrawerComponent,
    NavigationModalDrawerComponent,
    NavigationRailComponent,
    PlayerModule,
    SharedModule,
  ],
  providers: [provideExperimentalZonelessChangeDetection()],
  bootstrap: [AppComponent],
})
export class AppModule {}
