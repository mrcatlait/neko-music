import { Directive, HostListener, Input, inject } from '@angular/core'

import { DialogService } from '@core/services'
import { injectPortalContext } from '@core/tokens'

@Directive({
  selector: '[dialogClose]',
})
export class DialogCloseDirective {
  private readonly context = injectPortalContext()
  private readonly dialogService = inject(DialogService)

  @Input('dialogClose') result?: unknown

  @HostListener('click')
  onClick(): void {
    const dialogToClose = this.dialogService.findDialogById(this.context.id)

    if (dialogToClose) {
      dialogToClose.close()
    } else {
      console.warn('No dialog reference found to close')
    }
  }
}
