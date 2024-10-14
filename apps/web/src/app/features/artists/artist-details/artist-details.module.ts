import { NgModule } from '@angular/core'

import { ArtistDetailsState } from './state'
import { ArtistDetailsComponent } from './components'

import { SharedModule } from '@shared/shared.module'

@NgModule({
  imports: [SharedModule],
  declarations: [ArtistDetailsComponent],
  providers: [ArtistDetailsState],
  exports: [ArtistDetailsComponent],
})
export class ArtistDetailsModule {}
