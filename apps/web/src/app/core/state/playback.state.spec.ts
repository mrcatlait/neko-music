import { TestBed } from '@angular/core/testing'

import { PlaybackState } from './playback.state'
import { AudioState } from './audio.state'
import { UIState } from './ui.state'

import { SeoService } from '@core/services'
import { Track, Queue } from '@core/models'
import { RepeatOption } from '@core/enum'

describe('PlaybackState', () => {
  let playbackState: PlaybackState
  let audioStateMock: Partial<AudioState>
  let uiStateMock: Partial<UIState>

  beforeEach(() => {
    audioStateMock = {
      togglePlay: vi.fn(),
      load: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
    }

    uiStateMock = {
      openVisualizer: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        PlaybackState,
        { provide: AudioState, useValue: audioStateMock },
        { provide: UIState, useValue: uiStateMock },
        { provide: SeoService, useValue: {} },
      ],
    })

    playbackState = TestBed.inject(PlaybackState)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should toggle play if current track id matches payload track id', () => {
    // Arrange
    const trackId = 'track1'
    const sourceId = 'source1'
    const queue = { source: { name: sourceId, entityId: sourceId }, tracks: [{ id: trackId }] } as Queue

    playbackState.currentTrack.set({ id: trackId } as Track)
    playbackState.queue.set(queue)

    // Act
    playbackState.togglePlay({ queue, trackId })

    // Assert
    expect(playbackState.currentTrack()).toEqual({ id: trackId })
    expect(audioStateMock.togglePlay).toHaveBeenCalled()
    expect(audioStateMock.load).not.toHaveBeenCalled()
    expect(uiStateMock.openVisualizer).not.toHaveBeenCalled()
  })

  it('should set current track, queue, load audio, and open visualizer when toggling play with new track', () => {
    // Arrange
    const trackId = 'track2'
    const queue = { source: { name: 'source2' }, tracks: [{ id: 'track1' }, { id: trackId }] } as Queue

    // Act
    playbackState.togglePlay({ queue, trackId })

    // Assert
    expect(playbackState.currentTrack()).toEqual({ id: trackId })
    expect(playbackState.queue()).toEqual(queue)
    expect(audioStateMock.load).toHaveBeenCalledWith({ track: { id: trackId } })
    expect(uiStateMock.openVisualizer).toHaveBeenCalled()
  })

  it('should set the next track as current track when calling next', () => {
    // Arrange
    const currentTrack = { id: 'track1' } as Track
    const nextTrack = { id: 'track2' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [currentTrack, nextTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)

    // Act
    playbackState.next()

    // Assert
    expect(playbackState.currentTrack()).toEqual(nextTrack)
    expect(audioStateMock.load).toHaveBeenCalledWith({ track: nextTrack })
  })

  it('should set the previous track as current track when calling previous', () => {
    // Arrange
    const currentTrack = { id: 'track2' } as Track
    const previousTrack = { id: 'track1' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [previousTrack, currentTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)

    // Act
    playbackState.previous()

    // Assert
    expect(playbackState.currentTrack()).toEqual(previousTrack)
    expect(audioStateMock.load).toHaveBeenCalledWith({ track: previousTrack })
  })

  it('should toggle repeat option when calling toggleRepeat', () => {
    // Arrange
    playbackState.repeat.set(RepeatOption.None)

    // Act
    playbackState.toggleRepeat()
    expect(playbackState.repeat()).toEqual(RepeatOption.All)

    playbackState.toggleRepeat()
    expect(playbackState.repeat()).toEqual(RepeatOption.Single)

    playbackState.toggleRepeat()
    expect(playbackState.repeat()).toEqual(RepeatOption.None)
  })

  it('should toggle shuffle when calling toggleShuffle', () => {
    // Arrange
    playbackState.shuffle.set(false)

    // Act
    playbackState.toggleShuffle()
    expect(playbackState.shuffle()).toBe(true)

    playbackState.toggleShuffle()
    expect(playbackState.shuffle()).toBe(false)
  })

  it('should play next track when current track ends', () => {
    // Arrange
    const currentTrack = { id: 'track1' } as Track
    const nextTrack = { id: 'track2' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [currentTrack, nextTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)

    // Act
    playbackState.ended()

    // Assert
    expect(playbackState.currentTrack()).toEqual(nextTrack)
    expect(audioStateMock.load).toHaveBeenCalledWith({ track: nextTrack })
  })

  it('should play the same track again when repeat option is set to Single', () => {
    // Arrange
    const currentTrack = { id: 'track1' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [currentTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)
    playbackState.repeat.set(RepeatOption.Single)

    // Act
    playbackState.ended()

    // Assert
    expect(audioStateMock.play).toHaveBeenCalled()
  })

  it('should play the next track when repeat option is set to All', () => {
    // Arrange
    const currentTrack = { id: 'track1' } as Track
    const nextTrack = { id: 'track2' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [currentTrack, nextTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)
    playbackState.repeat.set(RepeatOption.All)

    // Act
    playbackState.ended()

    // Assert
    expect(playbackState.currentTrack()).toEqual(nextTrack)
    expect(audioStateMock.load).toHaveBeenCalledWith({ track: nextTrack })
  })

  it('should pause when current track is the last one and repeat option is set to None', () => {
    // Arrange
    const currentTrack = { id: 'track1' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [currentTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)
    playbackState.repeat.set(RepeatOption.None)

    // Act
    playbackState.ended()

    // Assert
    expect(audioStateMock.pause).toHaveBeenCalled()
  })

  it('should play the next track when current track is not the last one and repeat option is set to None', () => {
    // Arrange
    const currentTrack = { id: 'track1' } as Track
    const nextTrack = { id: 'track2' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [currentTrack, nextTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)
    playbackState.repeat.set(RepeatOption.None)

    // Act
    playbackState.ended()

    // Assert
    expect(playbackState.currentTrack()).toEqual(nextTrack)
    expect(audioStateMock.load).toHaveBeenCalledWith({ track: nextTrack })
  })

  it('should pause when current track is the last one and repeat option is set to None', () => {
    // Arrange
    const currentTrack = { id: 'track1' } as Track
    const queue: Queue = { source: { name: 'source1' }, tracks: [currentTrack] }
    playbackState.currentTrack.set(currentTrack)
    playbackState.queue.set(queue)
    playbackState.repeat.set(RepeatOption.None)

    // Act
    playbackState.ended()

    // Assert
    expect(audioStateMock.pause).toHaveBeenCalled()
  })
})
