import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { LayoutService } from './services'

import { Layout } from '@core/enum'

@Component({
  selector: 'neko-layout',
  templateUrl: 'layout.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly layoutService = inject(LayoutService)

  readonly layout = this.layoutService.layout
  Layout = Layout
}
