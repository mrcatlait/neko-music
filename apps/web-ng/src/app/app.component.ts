import { AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild, ViewContainerRef } from '@angular/core'

import { CoreModule } from '@core/core.module'
import { PortalService } from '@core/services'
import { AuthState } from '@core/state'
import { LayoutComponent } from '@features/layout/layout.component'

@Component({
  selector: 'neko-root',
  templateUrl: './app.component.html',
  imports: [LayoutComponent, CoreModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  private readonly portalService = inject(PortalService)
  private readonly authState = inject(AuthState)

  @ViewChild('viewContainer', { read: ViewContainerRef })
  private readonly vcr!: ViewContainerRef

  constructor() {
    this.authState.checkSession()
  }

  ngAfterViewInit(): void {
    this.portalService.attach(this.vcr)
  }
}
