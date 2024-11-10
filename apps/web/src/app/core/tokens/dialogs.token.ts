import { inject, InjectionToken, signal, WritableSignal } from '@angular/core'

import { PORTAL_CONTEXT } from './portal-context.token'

import { DialogRef } from '@core/services'

export const DIALOGS = new InjectionToken<WritableSignal<DialogRef[]>>('DIALOGS', {
  providedIn: 'root',
  factory: () => signal([]),
})

export const DIALOG_DATA = new InjectionToken<Record<string, unknown>>('DIALOG_DATA', {
  factory: () => {
    const context = inject(PORTAL_CONTEXT)
    return context.data ?? {}
  },
})
