import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'n-not-found-page',
  template: ` <h1>Not Found</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
