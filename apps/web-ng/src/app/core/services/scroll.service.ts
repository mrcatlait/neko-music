import { DOCUMENT } from '@angular/common'
import { Injectable, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private readonly document = inject(DOCUMENT)

  private readonly eventController = new AbortController()

  disable(): void {
    this.document.addEventListener('wheel', this.handleWheel, { passive: false, signal: this.eventController.signal })
    this.document.addEventListener('touchmove', this.handleWheel, {
      passive: false,
      signal: this.eventController.signal,
    })
    this.document.addEventListener('keydown', this.handleKeydown, {
      passive: false,
      signal: this.eventController.signal,
    })
  }

  enable(): void {
    this.eventController.abort()
  }

  private handleWheel(e: WheelEvent | TouchEvent): void {
    e.preventDefault()
  }

  private handleKeydown(e: KeyboardEvent): void {
    const authorizedInInputs = ['Space', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
    let keys = ['Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']

    if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLInputElement | HTMLTextAreaElement).tagName)) {
      keys = keys.filter((key) => !authorizedInInputs.includes(key))
    }

    if (keys.includes(e.code)) {
      e.preventDefault()
    }
  }
}
