import { trackList } from '../shared'

import { trackListNewReleasesSelectors } from '@selectors'

export const actions = {
  playTrack(track: string) {
    cy.getBySelector(trackListNewReleasesSelectors.trackContainer).within(() => {
      trackList.playTrack(track)
    })
  },
}
