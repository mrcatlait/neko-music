import { trackMediaCardSelectors } from 'selectors'

export const assertions = {
  assertActive(track: string) {
    cy.containsBySelector(trackMediaCardSelectors.trackMediaCard, track).as('trackMediaCard')
    cy.get('@trackMediaCard').findBySelector(trackMediaCardSelectors.playButton).should('exist')
    cy.get('@trackMediaCard')
      .findBySelector(trackMediaCardSelectors.trackImage)
      .should('exist')
      .and('have.prop', 'naturalWidth')
      .should('be.greaterThan', 0)
    cy.get('@trackMediaCard').should('have.class', 'active')
  },

  assertPlaying(track: string) {
    cy.containsBySelector(trackMediaCardSelectors.trackMediaCard, track).as('trackMediaCard')
    cy.get('@trackMediaCard').findBySelector(trackMediaCardSelectors.playButton).contains('pause').should('exist')
  },

  assertPaused(track: string) {
    cy.containsBySelector(trackMediaCardSelectors.trackMediaCard, track).as('trackMediaCard')
    cy.get('@trackMediaCard').findBySelector(trackMediaCardSelectors.playButton).contains('play_arrow').should('exist')
  },
}
