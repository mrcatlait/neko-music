import { InjectionToken } from '@angular/core'

export const WINDOW = new InjectionToken<Window>('apiUrl', { providedIn: 'root', factory: () => window })
