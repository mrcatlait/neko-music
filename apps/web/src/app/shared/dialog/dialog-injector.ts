import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, signal, WritableSignal } from '@angular/core'

import { DialogRef } from './dialog'

type Dialogs = WritableSignal<DialogRef<any, any>[]>

export const DIALOGS = new InjectionToken<Dialogs>('DIALOGS')

export const provideDialogs = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: DIALOGS, useValue: signal([]) }])
