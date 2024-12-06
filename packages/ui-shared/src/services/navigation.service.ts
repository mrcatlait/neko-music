import { inject, Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router)
  private readonly location = inject(Location)

  private readonly history: string[] = []

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
  }

  back(): void {
    this.history.pop()

    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl('/')
    }
  }
}
