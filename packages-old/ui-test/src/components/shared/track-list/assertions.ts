import { trackListItem } from '../track-list-item'

import { trackListItemSelectors, trackListSelectors } from '@selectors'

export const assertions = {
  assertVisible(label: string) {
    cy.getBySelector(trackListSelectors.trackListLabel).contains(label).should('be.visible')
    cy.getBySelector(trackListSelectors.trackListContainer).should('be.visible')
  },

  assertTracks(tracks: string[]) {
    cy.getBySelector(trackListSelectors.trackListContainer).within(() => {
      cy.getBySelector(trackListItemSelectors.trackListItem).should('have.length', tracks.length)

      tracks.forEach((track) => {
        trackListItem.assertVisible(track)
      })
    })
  },

  assertPlayingTrack(track: string) {
    cy.getBySelector(trackListSelectors.trackListContainer).within(() => {
      trackListItem.assertPlaying(track)
    })
  },

  assertPausedTrack(track: string) {
    cy.getBySelector(trackListSelectors.trackListContainer).within(() => {
      trackListItem.assertPaused(track)
    })
  },
}
