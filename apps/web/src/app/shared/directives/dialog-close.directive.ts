import { Directive, HostListener, Input, Optional, Inject } from '@angular/core'

import { DialogService } from '@core/services'
import { PORTAL_CONTEXT, PortalContext } from '@core/tokens'

@Directive({
  selector: '[dialogClose]',
})
export class DialogCloseDirective {
  @Input('dialogClose') result?: unknown

  constructor(
    @Optional() @Inject(PORTAL_CONTEXT) private context: PortalContext,
    private dialogService: DialogService,
  ) {}

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
