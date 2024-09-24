import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-player-volume',
  templateUrl: 'player-volume.component.html',
  styleUrls: ['player-volume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerVolumeComponent {
  changeVolume(event: Event) {
    const volume = Number((event.target as HTMLInputElement).value)

    // this.audioState.setVolume({ volume })
  }

  toggleMute() {
    // this.audioState.toggleMute()
  }
}
