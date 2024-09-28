import { playerSelectors } from '../../selectors'

export const assertions = {
  assertPlaying() {
    cy.getBySelector(playerSelectors.playButton).contains('pause').should('exist')
  },

  assertPaused() {
    cy.getBySelector(playerSelectors.playButton).contains('play_arrow').should('exist')
  },

  assertShuffleOn() {
    cy.getBySelector(playerSelectors.shuffleButton).should('not.have.class', 'inactive')
  },

  assertShuffleOff() {
    cy.getBySelector(playerSelectors.shuffleButton).should('have.class', 'inactive')
  },

  assertRepeatAllOn() {
    cy.getBySelector(playerSelectors.repeatButton).find('i').should('not.have.class', 'inactive').contains('repeat')
  },

  assertRepeatSingleOn() {
    cy.getBySelector(playerSelectors.repeatButton).find('i').should('not.have.class', 'inactive').contains('repeat_one')
  },

  assertRepeatOff() {
    cy.getBySelector(playerSelectors.repeatButton).find('i').should('have.class', 'inactive')
  },

  assertVisualizerOn() {
    cy.getBySelector(playerSelectors.visualizerButton).contains('fullscreen_exit')
  },

  assertVisualizerOff() {
    cy.getBySelector(playerSelectors.visualizerButton).contains('fullscreen')
  },

  assertVolume(volume: number) {
    cy.getBySelector(playerSelectors.volumeSlider).should('have.value', volume)
  },

  assertMuted() {
    cy.getBySelector(playerSelectors.volumeButton).contains('volume_off')
  },

  assertPlaybackTime(time: number) {
    cy.getBySelector(playerSelectors.playbackSlider).should('have.value', time)
  },

  assertTrack(track: string) {
    cy.getBySelector(playerSelectors.trackLabel).should('contain', track)
  },

  assertTrackImage() {
    cy.getBySelector(playerSelectors.trackImage)
      .should('be.visible')
      .and('have.prop', 'naturalWidth')
      .should('be.greaterThan', 0)
  },

  assertArtist(artist: string) {
    cy.getBySelector(playerSelectors.artistLabel).should('contain', artist)
  },
}
