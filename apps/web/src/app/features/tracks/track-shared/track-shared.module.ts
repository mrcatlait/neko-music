import { NgModule } from '@angular/core'

import { TrackArtistListComponent, TrackListItemComponent } from './components'

import { SharedModule } from '@shared/shared.module'

@NgModule({
  imports: [SharedModule],
  exports: [TrackArtistListComponent, TrackListItemComponent],
  declarations: [TrackArtistListComponent, TrackListItemComponent],
})
export class TrackSharedModule {}
