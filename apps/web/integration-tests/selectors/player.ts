import { Selectors } from '../types'

export const playerSelectors = {
  shuffleButton: 'player-shuffle-button',
  skipPreviousButton: 'player-skip-previous-button',
  playButton: 'player-play-button',
  skipNextButton: 'player-skip-next-button',
  repeatButton: 'player-repeat-button',
  remixLabel: 'player-remix-label',
  artistLabel: 'player-artist-label',
  currentTimeLabel: 'player-current-time-label',
  totalTimeLabel: 'player-total-time-label',
  playbackSlider: 'player-playback-slider',
  volumeSlider: 'player-volume-slider',
  volumeButton: 'player-volume-button',
  visualizerButton: 'player-visualizer-button',
} satisfies Selectors
