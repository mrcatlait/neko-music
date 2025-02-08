import { ChangeDetectionStrategy, Component, computed, HostListener, inject } from '@angular/core'

import { DialogService } from '@core/services/dialog.service'
import { DIALOGS } from '@core/tokens'

@Component({
  selector: 'neko-layout-dialogs',
  templateUrl: 'layout-dialogs.component.html',
  styleUrl: 'layout-dialogs.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDialogsComponent {
  private readonly dialogService = inject(DialogService)

  readonly dialogs = inject(DIALOGS)

  readonly hasDialogs = computed(() => this.dialogs().length > 0)

  @HostListener('document:keydown.escape')
  handleEscapePressed(): void {
    this.dialogService.closeAll()
  }
}
