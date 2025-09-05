import { Injectable } from '@angular/core'

import { Popover } from '../popover'
import { SNACKBARS } from './snackbars-injector'
import { SnackbarContext } from './snackbar-context'

@Injectable({
  providedIn: 'root',
  useFactory: () => new Snackbar(SNACKBARS),
})
export class Snackbar extends Popover<SnackbarContext> {
  close(id: string): void {
    this.items.update((items) => items.filter((item) => item.id !== id))
  }
}
