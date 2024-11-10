import { inject, Injectable, Type } from '@angular/core'

import { PortalComponent } from '@core/classes'
import { PortalContext } from '@core/tokens'
import { DIALOGS } from '@core/tokens/dialogs.token'

export interface DialogRef<T = any> {
  id: string
  context?: PortalContext
  component: PortalComponent<T>
  close: () => void
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly items = inject(DIALOGS)

  open<T>(component: Type<T>, context?: Record<string, unknown>): DialogRef<T> {
    const id = crypto.randomUUID()

    const dialogRef: DialogRef<T> = {
      id,
      context: {
        id,
        data: context,
      },
      component: new PortalComponent(component),
      close: () => {
        this.items.update((items) => items.filter((dialog) => dialog.id !== id))
      },
    }

    this.items.update((items) => [...items, dialogRef])
    return dialogRef
  }

  findDialogById(id: string): DialogRef | undefined {
    return this.items().find((dialog) => dialog.id === id)
  }

  closeAll(): void {
    this.items.set([])
  }
}
