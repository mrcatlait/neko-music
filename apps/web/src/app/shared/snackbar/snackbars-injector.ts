import { InjectionToken, signal, WritableSignal } from '@angular/core'

import { PopoverContext } from '../popover'
import { SnackbarContext } from './snackbar-context'

export const SNACKBARS = new InjectionToken<WritableSignal<PopoverContext<unknown, SnackbarContext>[]>>('SNACKBARS', {
  factory: () => signal([]),
})
