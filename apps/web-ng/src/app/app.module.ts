import { NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core'
// import { SharedModule } from '@shared/shared.module'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'

import { CoreModule } from '@core/core.module'
import { LayoutComponent } from '@features/layout/layout.component'

@NgModule({
  imports: [AppRoutingModule, CoreModule, LayoutComponent, AppComponent],
  providers: [provideExperimentalZonelessChangeDetection()],
  bootstrap: [AppComponent],
})
export class AppModule {}
