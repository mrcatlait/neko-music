import { navigation, trackNewReleases, player } from '@neko/web-test-utils/dsl'

import { interceptors } from '../interceptors'

describe('Track New Releases', () => {
  beforeEach(() => {
    interceptors.mockTrackNewReleases()
    navigation.goToHome()
  })

  it('should display a list of newly released tracks', () => {
    trackNewReleases.assertVisible()
    trackNewReleases.assertTracks([
      'Help You Out (ft. Jonathon Robbins)',
      'Flutter',
      'Howling (Ft. Asena)',
      'Help You Out (ft. Jonathon Robbins)',
    ])
  })

  it('should play a selected track from the new releases', () => {
    trackNewReleases.playTrack('Flutter')
    trackNewReleases.assertPlayingTrack('Flutter')

    player.assertPlaying()
    player.assertTrack('Flutter')

    player.pause()
    trackNewReleases.assertPausedTrack('Flutter')
  })
})
