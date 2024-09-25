import { trackMediaCard } from '../components/track-media-card'

import { trackNewReleasesSelectors } from 'selectors'

export const actions = {
  playTrack(track: string) {
    cy.getBySelector(trackNewReleasesSelectors.trackContainer).within(() => {
      trackMediaCard.play(track)
    })
  },
}
