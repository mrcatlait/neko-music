import { NgModule } from '@angular/core'

import { TrackArtistListComponent, TrackListComponent, TrackListItemComponent } from './components'

import { SharedModule } from '@shared/shared.module'

@NgModule({
  imports: [SharedModule],
  exports: [TrackArtistListComponent, TrackListComponent, TrackListItemComponent],
  declarations: [TrackArtistListComponent, TrackListComponent, TrackListItemComponent],
})
export class TrackSharedModule {}
