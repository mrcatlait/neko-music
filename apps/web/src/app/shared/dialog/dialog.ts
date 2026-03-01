import { inject, Injectable, Type } from '@angular/core'

import { ComponentPortal, PortalContext } from '../portal'
import { DIALOGS } from './dialog-injector'

export interface DialogRef<T, Context> {
  id: string
  context?: PortalContext<Context>
  component: ComponentPortal<T>
  close: () => void
}

@Injectable({ providedIn: 'root' })
export class Dialog {
  private readonly items = inject(DIALOGS)

  open<T, Context>(component: Type<T>, context?: Context): DialogRef<T, Context> {
    const id = crypto.randomUUID()

    const dialogRef: DialogRef<T, Context> = {
      id,
      context: {
        id,
        data: context,
      },
      component: new ComponentPortal(component),
      close: () => {
        this.items.update((items) => items.filter((dialog) => dialog.id !== id))
      },
    }

    this.items.update((items) => [...items, dialogRef])
    return dialogRef
  }

  findDialogById<T, Context>(id: string): DialogRef<T, Context> | undefined {
    return this.items().find((dialog) => dialog.id === id)
  }

  closeAll(): void {
    this.items.set([])
  }
}
