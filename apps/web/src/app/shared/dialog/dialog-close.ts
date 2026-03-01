import { Directive, HostListener, Input, inject } from '@angular/core'

import { Dialog } from './dialog'
import { PORTAL_CONTEXT } from '../portal'

@Directive({
  selector: '[dialogClose]',
})
export class DialogCloseDirective {
  private readonly context = inject(PORTAL_CONTEXT)
  private readonly dialog = inject(Dialog)

  @Input('dialogClose') result?: unknown

  @HostListener('click')
  onClick(): void {
    this.closeDialog()
  }

  private closeDialog(): void {
    const dialogToClose = this.dialog.findDialogById(this.context.id)

    if (dialogToClose) {
      dialogToClose.close()
    } else {
      console.warn('No dialog reference found to close')
    }
  }
}
