import { trackListItemSelectors } from '@neko/web-test-utils/selectors'

export const actions = {
  play(track: string) {
    cy.containsBySelector(trackListItemSelectors.trackListItem, track).as('trackListItem')
    cy.get('@trackListItem').findBySelector(trackListItemSelectors.trackLabel).click({ force: true })
  },

  pause(track: string) {
    cy.containsBySelector(trackListItemSelectors.trackListItem, track).as('trackListItem')
    cy.get('@trackListItem').findBySelector(trackListItemSelectors.playButton).click({ force: true })
  },

  openMenu(track: string) {
    cy.containsBySelector(trackListItemSelectors.trackListItem, track).as('trackListItem')
    cy.get('@trackListItem').findBySelector(trackListItemSelectors.menuButton).click({ force: true })
  },
}
