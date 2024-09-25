import { NgModule, Optional, SkipSelf } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { provideHttpClient } from '@angular/common/http'

import { EnsureModuleLoadedOnceGuard } from './guards'
import { devtoolsImports } from '../../devtools/devtools'
import { API_URL } from './tokens'

import { environment } from '@environment'

@NgModule({
  imports: [BrowserModule, devtoolsImports],
  providers: [provideHttpClient(), { provide: API_URL, useValue: environment.apiUrl }],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule)
  }
}
