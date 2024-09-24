import { navigationSelectors } from 'integration-tests/selectors'
import { routes } from 'integration-tests/support/routes'

export const actions = {
  goToHome() {
    cy.intercept('GET', '/artists/popular', { fixture: 'popular-artists.json' }).as('getPopularArtists')
    cy.intercept('GET', '/tracks/popular?take=12&page=1', { fixture: 'popular-tracks.json' }).as('getPopularTracks')

    cy.visit(routes.HOME)
  },

  goToExplore() {
    cy.getBySelector(navigationSelectors.exploreLink).click()
  },

  goToSearch() {
    cy.getBySelector(navigationSelectors.searchLink).click()
  },

  goToLibrary() {
    cy.getBySelector(navigationSelectors.libraryLink).click()
  },

  goToArtist() {
    cy.intercept(
      {
        method: 'GET',
        url: /artists\/((\w|\d)+-)+(\w|\d)+$/,
        headers: {
          accept: 'application/json',
        },
      },
      { fixture: 'artist-details.json' },
    ).as('getArtistDetails')
    cy.intercept('GET', /artists\/((\w|\d)+-)+(\w|\d)+\/tracks$/, { fixture: 'artist-tracks.json' }).as(
      'getArtistTracks',
    )

    cy.visit(routes.ARTIST_DETAILS)
  },
}
