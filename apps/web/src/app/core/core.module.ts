import { NgModule, Optional, SkipSelf } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

import { EnsureModuleLoadedOnceGuard } from './guards'
import { devtoolsImports } from '../../devtools/devtools'
import { API_URL } from './tokens'
import { AuthInterceptor } from './interceptors'

import { environment } from '@environment'

@NgModule({
  imports: [BrowserModule, devtoolsImports],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule)
  }
}
