import { NgModule, Optional, SkipSelf } from '@angular/core'
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

import { EnsureModuleLoadedOnceGuard } from './guards'
import { devtoolsImports } from '../../devtools/devtools'
import { API_URL, ENVIRONMENT } from './tokens'
import { AuthInterceptor, ErrorInterceptor } from './interceptors'

import { environment } from '@environment'

@NgModule({
  imports: [devtoolsImports],
  providers: [
    // provideHttpClient(withInterceptorsFromDi()),
    { provide: ENVIRONMENT, useValue: environment },
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule)
  }
}
