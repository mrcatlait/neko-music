import { trackListNewReleasesSelectors } from '../../selectors'
import { trackList } from '../components/track-list'

export const actions = {
  playTrack(track: string) {
    cy.getBySelector(trackListNewReleasesSelectors.trackContainer).within(() => {
      trackList.playTrack(track)
    })
  },
}
