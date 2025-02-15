import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'neko-play-icon',
  templateUrl: './play-icon.component.html',
  styleUrl: './play-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayIconComponent {
  readonly isPlaying = input.required<boolean>()
}
