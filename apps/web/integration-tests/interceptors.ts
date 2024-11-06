export const interceptors = {
  mockTrackNewReleases() {
    cy.intercept('GET', '/tracks/new?take=6&offset=0', { fixture: 'track-new-releases.json' }).as('getTrackNewReleases')
  },
  mockLoggedInState() {
    // Mock the session cookie
    cy.setCookie('neko.is.authenticated', 'true', {
      secure: true,
      sameSite: 'strict',
    })

    // Mock the session storage
    const mockSession = {
      user: {
        id: '1',
        username: 'testuser',
      },
      permissions: ['track:read', 'track:create'],
    }
    window.sessionStorage.setItem('session', JSON.stringify(mockSession))

    // Mock the whoami endpoint that AuthState uses to verify session
    cy.intercept('GET', '/auth/whoami', {
      statusCode: 200,
      body: mockSession,
    }).as('sessionCheck')
  },
  mockInvalidCredentials() {
    cy.intercept('POST', '/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials',
      },
    }).as('login')
  },
  mockValidCredentials() {
    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        username: 'User',
      },
    }).as('login')
  },
}
