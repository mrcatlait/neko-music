import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'n-overview-page',
  template: ` <h1>Overview</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {}
