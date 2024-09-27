import { trackListItem } from '../components'

import { trackListItemSelectors, trackNewReleasesSelectors } from 'selectors'

export const assertions = {
  assertVisible() {
    cy.getBySelector(trackNewReleasesSelectors.titleLabel).contains('New Releases').should('be.visible')
    cy.getBySelector(trackNewReleasesSelectors.trackContainer).should('be.visible')
  },

  assertTracks(tracks: string[]) {
    cy.getBySelector(trackNewReleasesSelectors.trackContainer).within(() => {
      cy.getBySelector(trackListItemSelectors.trackListItem).should('have.length', tracks.length)

      tracks.forEach((track) => {
        trackListItem.assertVisible(track)
      })
    })
  },

  assertPlayingTrack(track: string) {
    cy.getBySelector(trackNewReleasesSelectors.trackContainer).within(() => {
      trackListItem.assertPlaying(track)
    })
  },

  assertPausedTrack(track: string) {
    cy.getBySelector(trackNewReleasesSelectors.trackContainer).within(() => {
      trackListItem.assertPaused(track)
    })
  },
}
