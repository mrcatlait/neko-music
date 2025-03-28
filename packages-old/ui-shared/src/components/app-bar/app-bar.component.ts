import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, signal } from '@angular/core'
import { fromEvent, map, startWith, tap } from 'rxjs'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'

import { NavigationService } from '../../services'
import { injectWindow } from '../../providers'

@Component({
  selector: 'neko-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBarComponent implements AfterViewInit {
  private readonly window = injectWindow()
  private readonly navigationService = inject(NavigationService)
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef)

  @Input({ required: true })
  anchor: HTMLElement

  @Input()
  showBackArrow = true

  readonly width = signal(0)

  // https://dev.to/railsstudent/sticky-navigation-bar-after-scroll-using-rxjs-and-angular-4jjh
  private readonly sticky$ = fromEvent(this.window, 'scroll').pipe(
    takeUntilDestroyed(),
    map(() => this.window.scrollY > this.anchor.offsetTop + this.anchor.offsetHeight),
    startWith(false),
  )

  readonly sticky = toSignal(this.sticky$)

  constructor() {
    fromEvent(this.window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        map(() => this.elementRef.nativeElement.clientWidth),
        tap(this.width.set),
      )
      .subscribe()
  }

  ngAfterViewInit(): void {
    this.width.set(this.elementRef.nativeElement.clientWidth)
  }

  handleBackClick(): void {
    this.navigationService.back()
  }
}
