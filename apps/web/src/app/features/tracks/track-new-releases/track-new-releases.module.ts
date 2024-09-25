import { NgModule } from '@angular/core'

import { TrackNewReleasesComponent } from './components/track-new-releases/track-new-releases.component'
import { TrackNewReleaseState } from './state'

import { SharedModule } from '@shared/shared.module'

@NgModule({
  imports: [SharedModule],
  declarations: [TrackNewReleasesComponent],
  providers: [TrackNewReleaseState],
  exports: [TrackNewReleasesComponent],
})
export class TrackNewReleasesModule {}
