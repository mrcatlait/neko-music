import { ChangeDetectionStrategy, Component, computed, HostListener, inject } from '@angular/core'

import { Dialog, DIALOGS } from '@/shared/dialog'
import { PortalOutlet } from '@/shared/portal'

@Component({
  selector: 'n-dialog-outlet',
  imports: [PortalOutlet],
  template: `
    @if (hasDialogs()) {
      <div class="overlay"></div>

      @for (dialog of dialogs(); track dialog.id) {
        <section
          aria-modal="true"
          class="dialog-container"
          role="dialog"
        >
          <ng-container *portalOutlet="dialog.component; context: dialog.context" />
        </section>
      }
    }
  `,
  styleUrl: './dialog-outlet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogOutlet {
  private readonly dialog = inject(Dialog)

  readonly dialogs = inject(DIALOGS)

  readonly hasDialogs = computed(() => this.dialogs().length > 0)

  @HostListener('document:keydown.escape')
  handleEscapePressed(): void {
    this.dialog.closeAll()
  }
}
