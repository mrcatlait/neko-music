import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core'

import { ArtistDetailsState } from './artist-details.state'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  imports: [SharedModule],
  providers: [ArtistDetailsState],
  selector: 'neko-artist-details',
  templateUrl: './artist-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDetailsComponent implements OnInit {
  @Input({ required: true }) artistId: string

  private readonly artistDetailsState = inject(ArtistDetailsState)

  readonly artist = this.artistDetailsState.artist
  readonly loading = this.artistDetailsState.loading

  ngOnInit() {
    this.artistDetailsState.fetch({ artistId: this.artistId })
  }
}
