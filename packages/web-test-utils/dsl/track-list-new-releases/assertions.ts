import { trackListNewReleasesSelectors } from '../../selectors'
import { trackList } from '../components/track-list'

export const assertions = {
  assertVisible() {
    cy.getBySelector(trackListNewReleasesSelectors.trackContainer).within(() => {
      trackList.assertVisible('New Releases')
    })
  },

  assertTracks(tracks: string[]) {
    cy.getBySelector(trackListNewReleasesSelectors.trackContainer).within(() => {
      trackList.assertTracks(tracks)
    })
  },

  assertPlayingTrack(track: string) {
    cy.getBySelector(trackListNewReleasesSelectors.trackContainer).within(() => {
      trackList.assertPlayingTrack(track)
    })
  },

  assertPausedTrack(track: string) {
    cy.getBySelector(trackListNewReleasesSelectors.trackContainer).within(() => {
      trackList.assertPausedTrack(track)
    })
  },
}