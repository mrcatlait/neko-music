import { playerSelectors } from 'integration-tests/selectors'

export const actions = {
  play() {
    cy.getBySelector(playerSelectors.playButton).contains('play_arrow').click()
  },

  pause() {
    cy.getBySelector(playerSelectors.playButton).contains('pause').click()
  },

  mute() {
    cy.getBySelector(playerSelectors.volumeButton).contains('volume_up').click()
  },

  skipToNextSong() {
    cy.getBySelector(playerSelectors.skipNextButton).click()
  },

  skipToPreviousSong() {
    cy.getBySelector(playerSelectors.skipPreviousButton).click()
  },

  toggleShuffle() {
    cy.getBySelector(playerSelectors.shuffleButton).click()
  },

  toggleRepeat() {
    cy.getBySelector(playerSelectors.repeatButton).click()
  },

  toggleVisualizer() {
    cy.getBySelector(playerSelectors.visualizerButton).click()
  },

  setVolume(volume: number) {
    cy.getBySelector(playerSelectors.volumeSlider).invoke('val', volume).trigger('input')
  },

  setPlaybackTime(time: number) {
    cy.getBySelector(playerSelectors.playbackSlider).invoke('val', time).trigger('input')
  },
}
