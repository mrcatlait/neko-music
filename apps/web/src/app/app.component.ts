import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild, ViewContainerRef } from '@angular/core'

import { PortalService } from '@core/services'
import { LayoutComponent } from '@features/layout'

@Component({
  selector: 'neko-root',
  imports: [LayoutComponent],
  template: `<neko-layout /><ng-container #viewContainer></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  private readonly portalService = inject(PortalService)

  private readonly vcr = viewChild('viewContainer', { read: ViewContainerRef })

  ngAfterViewInit(): void {
    const component = this.vcr()

    if (!component) {
      throw new Error('ViewContainerRef is not found')
    }

    this.portalService.attach(component)
  }
}
