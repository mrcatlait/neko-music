import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild, ViewContainerRef } from '@angular/core'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { RouterOutlet } from '@angular/router'
import { PortalService } from '@neko/ui-shared/services'

ModuleRegistry.registerModules([AllCommunityModule])

@Component({
  selector: 'n-root',
  imports: [RouterOutlet],
  template: `<router-outlet /><ng-container #viewContainer></ng-container>`,
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
