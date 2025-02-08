import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core'

import { PlayIconComponent } from '../play-icon/play-icon.component'

import { ButtonDirective } from '@shared/directives'

@Component({
  selector: 'neko-media-card',
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, NgOptimizedImage, PlayIconComponent],
})
export class MediaCardComponent {
  @Input({ required: true }) isPlaying: boolean
  @Input({ required: true }) imageUrl: string

  @Output() togglePlay = new EventEmitter<void>()

  @HostListener('click')
  handleClick() {
    this.togglePlay.emit()
  }
}
