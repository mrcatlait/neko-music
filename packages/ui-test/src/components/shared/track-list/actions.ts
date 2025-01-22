import { trackListItem } from '../track-list-item'

import { trackListSelectors } from '@selectors'

export const actions = {
  playTrack(track: string) {
    cy.getBySelector(trackListSelectors.trackListContainer).within(() => {
      trackListItem.play(track)
    })
  },
}
