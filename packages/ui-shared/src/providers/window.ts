import { inject, InjectionToken } from '@angular/core'

export const WINDOW = new InjectionToken<Window>('WINDOW')

export function windowProvider(document: Document) {
  return document.defaultView
}

export const injectWindow = <T extends Window>(): T => inject<T>(WINDOW)
