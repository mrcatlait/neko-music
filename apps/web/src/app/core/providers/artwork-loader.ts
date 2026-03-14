import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core'

type ArtworkLoader = (src: string) => string

export const ARTWORK_LOADER_TOKEN = new InjectionToken<ArtworkLoader>('ARTWORK_LOADER_TOKEN')

export const provideArtworkLoader = (baseUrl: string): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: ARTWORK_LOADER_TOKEN,
      useValue: (src: string) => new URL(`${baseUrl}/${src}`).href,
    },
  ])
