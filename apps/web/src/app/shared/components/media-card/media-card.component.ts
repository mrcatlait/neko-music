import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core'

@Component({
  selector: 'neko-media-card',
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
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
