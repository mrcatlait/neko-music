import { Injectable, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationSkipped, NavigationStart, Router } from '@angular/router'
import { filter } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UIState {
  private readonly router = inject(Router)

  readonly isVisualizerOpen = signal(false)

  constructor() {
    this.closeVisualizerOnNavigation()
  }

  toggleVisualizer(): void {
    this.isVisualizerOpen.update((isOpen) => !isOpen)
  }

  openVisualizer(): void {
    this.isVisualizerOpen.set(true)
  }

  closeVisualizer(): void {
    this.isVisualizerOpen.set(false)
  }

  private closeVisualizerOnNavigation() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart || event instanceof NavigationSkipped),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.closeVisualizer()
      })
  }
}
