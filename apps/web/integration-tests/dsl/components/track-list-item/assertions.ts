import { trackListItemSelectors } from 'selectors'

export const assertions = {
  assertVisible(track: string) {
    cy.containsBySelector(trackListItemSelectors.trackListItem, track).as('trackListItem')
    cy.get('@trackListItem').findBySelector(trackListItemSelectors.playButton).should('exist')
    cy.get('@trackListItem').findBySelector(trackListItemSelectors.trackImage).should('exist')
    // .and('have.prop', 'naturalWidth')
    // .should('be.greaterThan', 0)
  },

  assertPlaying(track: string) {
    cy.containsBySelector(trackListItemSelectors.trackListItem, track).as('trackListItem')
    cy.get('@trackListItem').should('have.class', 'track-list-item-active')
    cy.get('@trackListItem').findBySelector(trackListItemSelectors.playButton).contains('pause').should('exist')
  },

  assertPaused(track: string) {
    cy.containsBySelector(trackListItemSelectors.trackListItem, track).as('trackListItem')
    cy.get('@trackListItem').should('have.class', 'track-list-item-active')
    cy.get('@trackListItem').findBySelector(trackListItemSelectors.playButton).contains('play_arrow').should('exist')
  },
}
