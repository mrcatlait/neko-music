import { navigation, player, trackListNewReleases } from '@neko/web-test-utils/dsl'

import { interceptors } from '../interceptors'

describe('Player', () => {
  beforeEach(() => {
    interceptors.mockLoggedInState()
    interceptors.mockTrackNewReleases()
    navigation.goToHome()
    trackListNewReleases.playTrack('Flutter')
    player.pause()
  })

  it('should display track details', () => {
    player.assertTrack('Flutter')
    player.assertArtist('Diamond Eyes')
    player.assertTrackImage()
  })

  it('should toggle between play and pause states', () => {
    player.assertPaused()

    player.play()
    player.assertPlaying()

    player.pause()
    player.assertPaused()
  })

  it('should skip to the next track', () => {
    player.skipToNextTrack()
    player.assertPlaying()
    player.assertTrack('Howling (Ft. Asena)')
  })

  it('should skip to the previous track', () => {
    player.skipToPreviousTrack()
    player.assertPlaying()
    player.assertTrack('Help You Out (ft. Jonathon Robbins)')
  })

  it('should toggle shuffle mode correctly', () => {
    player.assertShuffleOff()

    player.toggleShuffle()
    player.assertShuffleOn()

    player.toggleShuffle()
    player.assertShuffleOff()
  })

  it('should toggle repeat modes correctly', () => {
    player.assertRepeatOff()

    player.toggleRepeat()
    player.assertRepeatAllOn()

    player.toggleRepeat()
    player.assertRepeatSingleOn()

    player.toggleRepeat()
    player.assertRepeatOff()
  })

  it('should handle volume changes correctly', () => {
    const initialVolume = 75
    player.setVolume(initialVolume)
    player.assertVolume(initialVolume)

    player.mute()
    player.assertMuted()
    player.assertVolume(0)

    player.unmute()
    player.assertVolume(initialVolume)

    player.setVolume(0)
    player.assertMuted()
  })

  it('should set the playback time', () => {
    const time = 120
    player.setPlaybackTime(time)
    player.assertPlaybackTime(time)
  })
})
