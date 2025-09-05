import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { PORTAL_CONTEXT, PortalContext } from '../portal'
import { SnackbarContext } from './snackbar-context'
import { IconButton } from '../components'
import { Snackbar } from './snackbar'

@Component({
  selector: 'n-info-snackbar',
  imports: [IconButton],
  template: `
    <div class="info-snackbar">
      <span class="label-large">{{ context.data?.message }}</span>

      <button
        aria-label="Close"
        class="info-snackbar__close"
        nIconButton
        type="button"
        (click)="close()"
      >
        <i>close</i>
      </button>
    </div>
  `,
  styles: `
    .info-snackbar {
      display: flex;
      align-items: center;
      height: 48px;
      margin: 8px;
      gap: 12px;
      width: fit-content;
      padding-left: 16px;
      border-radius: var(--shape-corner-extra-small);
      background: var(--color-inverse-surface);
      color: var(--color-inverse-on-surface);

      &__close {
        --n-icon-button-color: var(--color-inverse-on-surface);

        margin-right: 4px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoSnackbar {
  protected readonly snackbar = inject(Snackbar)
  protected readonly context = inject<PortalContext<SnackbarContext>>(PORTAL_CONTEXT)

  protected close(): void {
    this.snackbar.close(this.context.id)
  }
}
