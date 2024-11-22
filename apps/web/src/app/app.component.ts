import { AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild, ViewContainerRef } from '@angular/core'

import { PortalService } from '@core/services'
import { AuthState } from '@core/state'

@Component({
  selector: 'neko-root',
  templateUrl: './app.component.html',
  standalone: false,
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
