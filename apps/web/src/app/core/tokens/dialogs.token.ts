import { InjectionToken, signal, WritableSignal } from '@angular/core'

import { DialogRef } from '@core/services'

export const DIALOGS = new InjectionToken<WritableSignal<DialogRef[]>>('DIALOGS', {
  providedIn: 'root',
  factory: () => signal([]),
})
