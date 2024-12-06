import { inject } from '@angular/core'

import { ENVIRONMENT } from './environment.token'

export const injectApiUrl = (): string => inject(ENVIRONMENT).apiUrl
