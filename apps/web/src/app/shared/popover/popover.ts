import { inject, Injectable, ProviderToken, Type, WritableSignal } from '@angular/core'

import { ComponentPortal } from '../portal'
import { PopoverContext } from './popover-context'

import { CRYPTO } from '@/core/injectors'

type Items = WritableSignal<PopoverContext<unknown, unknown>[]>

@Injectable()
export abstract class Popover<Context> {
  private readonly crypto = inject(CRYPTO)

  protected readonly items: Items

  constructor(itemsToken: ProviderToken<Items>) {
    this.items = inject(itemsToken)
  }

  open<T>(component: Type<T>, context?: Context): PopoverContext<T, Context> {
    const id = this.crypto.randomUUID()

    const popoverRef: PopoverContext<T, Context> = {
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

    this.items.update((items) => [...items, popoverRef])
    return popoverRef
  }
}
