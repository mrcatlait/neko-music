import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { SNACKBARS } from './snackbars-injector'
import { PortalOutlet } from '../portal'

@Component({
  selector: 'n-snackbar-outlet',
  imports: [PortalOutlet],
  template: `
    @for (snackbar of snackbars(); track snackbar.id) {
      <ng-container *portalOutlet="snackbar.component; context: snackbar.context" />
    }
  `,
  styles: `
    @use 'abstracts' as abstracts;

    :host {
      position: fixed;
      bottom: 8px;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      @include abstracts.elevation(3);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarOutlet {
  protected readonly snackbars = inject(SNACKBARS)
}
