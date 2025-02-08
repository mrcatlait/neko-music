import { InjectionToken, signal, WritableSignal } from '@angular/core'

import { DialogRef } from '@core/services'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DIALOGS = new InjectionToken<WritableSignal<DialogRef<any, any>[]>>('DIALOGS', {
  providedIn: 'root',
  factory: () => signal([]),
})
