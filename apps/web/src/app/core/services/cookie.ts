import { DOCUMENT } from '@angular/common'
import { Injectable, inject } from '@angular/core'

type SameSite = 'Lax' | 'None' | 'Strict'

export interface CookieOptions {
  name: string
  value: string
  expires?: number | Date
  secure?: boolean
  sameSite?: SameSite
  path?: string
}

const DAY = 1000 * 60 * 60 * 24

@Injectable({
  providedIn: 'root',
})
export class Cookie {
  private readonly document = inject(DOCUMENT)

  private readonly prefix = 'n.'

  get(name: string): string | undefined {
    const nameWithPrefix = this.prefix + name

    if (this.check(nameWithPrefix)) {
      name = encodeURIComponent(nameWithPrefix)

      const regExp = this.getCookieRegExp(name)
      const result = regExp.exec(this.document.cookie)

      return result?.[1] ? this.safeDecodeURIComponent(result[1]) : ''
    }

    return ''
  }

  set({ name, value, expires, secure, path = '/' }: CookieOptions): void {
    const nameWithPrefix = this.prefix + name
    let cookieString: string = encodeURIComponent(nameWithPrefix) + '=' + encodeURIComponent(value) + ';'

    if (expires) {
      if (typeof expires === 'number') {
        const dateExpires = new Date(new Date().getTime() + expires * DAY)

        cookieString += 'Expires=' + dateExpires.toUTCString() + ';'
      } else {
        cookieString += 'Expires=' + expires.toUTCString() + ';'
      }
    }

    if (secure) {
      cookieString += 'Secure;'
    }

    if (path) {
      cookieString += `Path=${path};`
    }

    cookieString += 'SameSite=Strict;'

    this.document.cookie = cookieString
  }

  delete(name: string): void {
    const expires = new Date('Thu, 01 Jan 1970 00:00:01 GMT')
    this.set({ name, value: '', expires })
  }

  private check(name: string): boolean {
    name = encodeURIComponent(name)
    const regExp = this.getCookieRegExp(name)

    return regExp.test(this.document.cookie)
  }

  private getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(/([[\]{}()|=;+?,.*^$])/gi, '\\$1')

    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g')
  }

  private safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent)
    } catch {
      return encodedURIComponent
    }
  }
}
