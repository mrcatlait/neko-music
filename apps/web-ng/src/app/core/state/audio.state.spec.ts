import { TestBed } from '@angular/core/testing'

import { AudioState } from './audio.state'

import { Track } from '@core/models'
import { AudioService, CookieService } from '@core/services'
import { PlayerStatus } from '@core/enum'

describe('AudioState', () => {
  let audioState: AudioState
  let audioServiceMock: Partial<AudioService>
  let cookieServiceMock: Partial<CookieService>

  beforeEach(() => {
    audioServiceMock = {
      load: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
      toggleMute: vi.fn(),
    }

    cookieServiceMock = {
      set: vi.fn(),
      get: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        AudioState,
        { provide: AudioService, useValue: audioServiceMock },
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    })

    audioState = TestBed.inject(AudioState)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should load the tracks and set the initial state', () => {
    // Arrange
    const track = { id: '1', duration: 120 } as Track

    // Act
    audioState.load({ track })

    // Assert
    expect(audioState.status()).toBe(PlayerStatus.Loading)
    expect(audioState.duration()).toBe(track.duration)
    expect(audioState.currentTime()).toBe(0)
    expect(audioServiceMock.load).toHaveBeenCalledWith(track.id)
    expect(cookieServiceMock.get).toHaveBeenCalledWith('volume')
  })

  it('should play the audio', () => {
    // Act
    audioState.play()

    // Assert
    expect(audioState.status()).toBe(PlayerStatus.Playing)
    expect(audioServiceMock.play).toHaveBeenCalled()
  })

  it('should pause the audio', () => {
    // Act
    audioState.pause()

    // Assert
    expect(audioState.status()).toBe(PlayerStatus.Paused)
    expect(audioServiceMock.pause).toHaveBeenCalled()
  })

  it('should pause if toggled play/pause when Playing', () => {
    // Arrange
    const status = PlayerStatus.Playing
    audioState.status.set(status)

    // Act
    audioState.togglePlay()

    // Assert
    expect(audioState.status()).toBe(PlayerStatus.Paused)
    expect(audioServiceMock.pause).toHaveBeenCalled()
  })

  it('should play if toggled play/pause when Paused', () => {
    // Arrange
    const status = PlayerStatus.Paused
    audioState.status.set(status)

    // Act
    audioState.togglePlay()

    // Assert
    expect(audioState.status()).toBe(PlayerStatus.Playing)
    expect(audioServiceMock.play).toHaveBeenCalled()
  })

  it('should do noting if toggled play/pause when not Playing or Paused', () => {
    // Arrange
    const status = PlayerStatus.Pending
    audioState.status.set(status)

    // Act
    audioState.togglePlay()

    // Assert
    expect(audioState.status()).toBe(PlayerStatus.Pending)
    expect(audioServiceMock.play).not.toHaveBeenCalled()
    expect(audioServiceMock.pause).not.toHaveBeenCalled()
  })

  it('should seek to the specified time', () => {
    // Arrange
    const time = 60

    // Act
    audioState.seek({ time })

    // Assert
    expect(audioState.currentTime()).toBe(time)
    expect(audioServiceMock.seek).toHaveBeenCalledWith(time)
  })

  it('should set the current time', () => {
    // Arrange
    const time = 30

    // Act
    audioState.setTime({ time })

    // Assert
    expect(audioState.currentTime()).toBe(time)
  })

  it('should set the volume and update the muted state', () => {
    // Arrange
    const volume = 80

    // Act
    audioState.setVolume({ volume })

    // Assert
    expect(audioState.volume()).toBe(volume)
    expect(audioState.muted()).toBe(false)

    expect(audioServiceMock.setVolume).toHaveBeenCalledWith(volume)
    expect(cookieServiceMock.set).toHaveBeenCalledWith({
      name: 'volume',
      value: String(volume),
      expires: 30,
    })
  })

  it('should toggle the mute state', () => {
    // Arrange
    const volume = 50

    // Act
    audioState.volume.set(volume)
    audioState.toggleMute()

    // Assert
    expect(audioState.muted()).toBe(true)
    expect(audioServiceMock.toggleMute).toHaveBeenCalled()
  })

  it('should mute the audio when the volume is 0', () => {
    // Arrange
    const volume = 0

    // Act
    audioState.setVolume({ volume })

    // Assert
    expect(audioState.muted()).toBe(true)
  })
})
