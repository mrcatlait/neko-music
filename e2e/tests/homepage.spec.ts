import { navigation, trackListNewReleases, player } from '@neko/web-test-utils/dsl'

describe('Homepage', () => {
  beforeEach(() => {
    navigation.goToHome()
  })

  it('should display the homepage with new releases', () => {
    trackListNewReleases.assertVisible()
    trackListNewReleases.assertTracks(['Bad Romance', 'Poker Face', 'Telephone'])
  })

  it('should play a track from new releases', () => {
    trackListNewReleases.playTrack('Bad Romance')

    trackListNewReleases.assertPlayingTrack('Bad Romance')
    player.assertPlaying()
    player.assertTrack('Bad Romance')
    player.assertArtist('Lady Gaga')

    player.pause()

    trackListNewReleases.assertPausedTrack('Bad Romance')
    player.assertPaused()
  })
})
