import '@neko/ui-test/commands'

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
})

beforeEach(() => {
  cy.intercept('GET', /\/.+\.(jpg|jpeg|png)$/, { fixture: 'image.jpg' }).as('getImage')
  cy.intercept('GET', /\/.+\.(mpd)$/, { fixture: 'stream/manifest.mpd,null' }).as('getAudioManifest')
  cy.intercept('GET', /\/.+\.(m4s)$/, (req) => {
    const fileName = req.url.split('/').pop()
    const fixtureName = `stream/${fileName},null`
    req.reply({ fixture: fixtureName })
  }).as('getAudioStreamChunk')
})
