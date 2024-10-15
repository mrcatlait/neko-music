import { navigation, trackListNewReleases, player } from '@neko/web-test-utils/dsl'

import { interceptors } from '../interceptors'

describe('Track List New Releases', () => {
  beforeEach(() => {
    interceptors.mockTrackNewReleases()
    navigation.goToHome()
  })

  it('should display a list of newly released tracks', () => {
    trackListNewReleases.assertVisible()
    trackListNewReleases.assertTracks([
      'Help You Out (ft. Jonathon Robbins)',
      'Flutter',
      'Howling (Ft. Asena)',
      'Help You Out (ft. Jonathon Robbins)',
    ])
  })

  it('should play a selected track from the new releases', () => {
    trackListNewReleases.playTrack('Flutter')
    trackListNewReleases.assertPlayingTrack('Flutter')

    player.assertPlaying()
    player.assertTrack('Flutter')

    player.pause()
    trackListNewReleases.assertPausedTrack('Flutter')
  })
})