import { DOCUMENT } from '@angular/common'
import {
  Directive,
  HostListener,
  Input,
  inject,
  TemplateRef,
  EmbeddedViewRef,
  OnDestroy,
  ElementRef,
  Renderer2,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core'

import { PortalService, ScrollService } from '@core/services'

interface Position {
  x: number
  y: number
}

// projects\core\directives\dropdown\dropdown-position-sided.directive.ts
@Directive({
  selector: '[nekoDropdownTrigger]',
  standalone: false,
})
export class DropdownTriggerDirective implements OnChanges, OnDestroy {
  private readonly document = inject(DOCUMENT)
  private readonly renderer = inject(Renderer2)
  private readonly portalService = inject(PortalService)
  private readonly scrollService = inject(ScrollService)

  private readonly elRef = inject(ElementRef)

  private viewRef?: EmbeddedViewRef<unknown>

  @Input({ required: true })
  nekoDropdownTrigger: TemplateRef<HTMLElement>

  @Input()
  nekoDropdownOpen: boolean | '' = false

  @Output()
  readonly nekoDropdownOpenChange = new EventEmitter<boolean>()

  private firstClick = true

  ngOnChanges(): void {
    this.update(Boolean(this.nekoDropdownOpen))
  }

  ngOnDestroy(): void {
    this.viewRef?.destroy()
  }

  @HostListener('click')
  protected handleClick(): void {
    this.update(!this.nekoDropdownOpen)
  }

  private update(open: boolean): void {
    if (open) {
      if (open === this.nekoDropdownOpen) {
        return
      }

      this.open()
    } else {
      this.close()
    }

    this.nekoDropdownOpen = open
    this.nekoDropdownOpenChange.emit(open)
  }

  private open(): void {
    this.viewRef?.destroy()
    this.viewRef = this.portalService.addTemplate(this.nekoDropdownTrigger)
    this.scrollService.disable()
    this.firstClick = true
    this.addEventListener()

    const position = this.getPosition()

    this.renderer.setStyle(this.safeDropdownContent, 'left', `${position.x}px`)
    this.renderer.setStyle(this.safeDropdownContent, 'top', `${position.y}px`)
  }

  private close(): void {
    if (this.viewRef) {
      this.portalService.removeTemplate(this.viewRef)
    }

    this.viewRef?.destroy()
    this.scrollService.enable()
    this.removeEventListener()
  }

  private addEventListener(): void {
    this.document.addEventListener('keydown', this.escapePressedListener)
    this.document.addEventListener('click', this.clickOutsideListener)
  }

  private removeEventListener(): void {
    this.document.removeEventListener('keydown', this.escapePressedListener)
    this.document.removeEventListener('click', this.clickOutsideListener)
  }

  private readonly escapePressedListener = (event: KeyboardEvent): void => {
    if (event.code === 'Escape') {
      this.update(false)
    }
  }

  private readonly clickOutsideListener = (event: Event): void => {
    if (this.firstClick) {
      this.firstClick = false
      return
    }

    const withinBoundaries = event.composedPath().includes(this.safeDropdownContent)

    if (!withinBoundaries) {
      this.update(false)
    }
  }

  private getPosition(): Position {
    const anchorElement = this.elRef.nativeElement

    const anchorRect = anchorElement.getBoundingClientRect()

    const menuRect = this.safeDropdownContent.getBoundingClientRect()

    const marginThreshold = 16

    let y = anchorRect.bottom
    const heightThreshold = window.innerHeight - marginThreshold - menuRect.height

    if (y > heightThreshold) {
      y = anchorRect.top - menuRect.height
    }

    let x = anchorRect.left
    const widthThreshold = window.innerWidth - marginThreshold - menuRect.width

    if (x > widthThreshold) {
      x = anchorRect.right - menuRect.width
    }

    return {
      y,
      x,
    }
  }

  private get safeDropdownContent(): HTMLElement {
    if (!this.viewRef) {
      throw new Error('Dropdown not initialized')
    }

    return this.viewRef.rootNodes[0]
  }
}
