import { trackListItem } from '../components'

import { trackNewReleasesSelectors } from 'selectors'

export const actions = {
  playTrack(track: string) {
    cy.getBySelector(trackNewReleasesSelectors.trackContainer).within(() => {
      trackListItem.play(track)
    })
  },
}
