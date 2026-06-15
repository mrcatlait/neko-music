import { InjectionToken, Provider } from '@angular/core'

const DEFAULT_DATA_SOURCES = {
  youtube: 'YouTube',
  filesystem: 'Filesystem',
  soundcloud: 'SoundCloud',
}

export const DATA_SOURCES = new InjectionToken<Record<string, string>>('DATA_SOURCES')
export const provideDataSources = (): Provider => [{ provide: DATA_SOURCES, useValue: DEFAULT_DATA_SOURCES }]
