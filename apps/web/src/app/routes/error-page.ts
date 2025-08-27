import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'n-error-page',
  template: ` <h1>Error</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {}
