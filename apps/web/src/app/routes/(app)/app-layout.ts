import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { PlaybackControls } from '@/features/playback/playback-controls'

@Component({
  selector: 'n-app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, PlaybackControls],
  templateUrl: './app-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {}
