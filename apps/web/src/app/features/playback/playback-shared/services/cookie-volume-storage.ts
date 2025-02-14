import { inject, Injectable } from '@angular/core'
import { CookieService } from '@neko/ui-shared/services'

const VOLUME_COOKIE = 'volume'

@Injectable()
export class CookieVolumeStorage {
  private readonly cookieService = inject(CookieService)

  saveVolume(volume: number): void {
    this.cookieService.set({
      name: VOLUME_COOKIE,
      value: String(volume),
      expires: 30,
    })
  }

  loadVolume(): number | null {
    const value = this.cookieService.get(VOLUME_COOKIE)
    return value ? Number(value) : null
  }
}
