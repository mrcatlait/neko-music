import { trackMediaCardSelectors } from 'selectors'

export const actions = {
  play(track: string) {
    cy.containsBySelector(trackMediaCardSelectors.trackMediaCard, track).as('trackMediaCard')
    cy.get('@trackMediaCard').findBySelector(trackMediaCardSelectors.playButton).click({ force: true })
  },

  pause(track: string) {
    cy.containsBySelector(trackMediaCardSelectors.trackMediaCard, track).as('trackMediaCard')
    cy.get('@trackMediaCard').findBySelector(trackMediaCardSelectors.playButton).click({ force: true })
  },

  openMenu(track: string) {
    cy.containsBySelector(trackMediaCardSelectors.trackMediaCard, track).as('trackMediaCard')
    cy.get('@trackMediaCard').findBySelector(trackMediaCardSelectors.menuButton).click({ force: true })
  },
}
