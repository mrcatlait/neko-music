import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { Player } from '@/domains/playback/player'

@Component({
  selector: 'n-main-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Player],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
