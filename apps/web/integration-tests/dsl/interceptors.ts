export const interceptors = {
  mockTrackNewReleases() {
    cy.intercept('GET', '/tracks/new?take=6&offset=0', { fixture: 'track-new-releases.json' }).as('getTrackNewReleases')
  },
}
