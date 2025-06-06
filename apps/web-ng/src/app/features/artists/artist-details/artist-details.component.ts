import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core'
import { NgIf } from '@angular/common'

import { ArtistDetailsState } from './artist-details.state'

import { SelectorDirective } from '@shared/directives'
import { ImageUrlPipe } from '@shared/pipes'
import { AppBarComponent } from '@shared/components'

@Component({
  standalone: true,
  imports: [SelectorDirective, NgIf, ImageUrlPipe, AppBarComponent],
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
