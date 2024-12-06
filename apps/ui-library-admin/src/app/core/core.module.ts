import { NgModule, Optional, SkipSelf } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

@NgModule({
  imports: [BrowserModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule)
  }
}
