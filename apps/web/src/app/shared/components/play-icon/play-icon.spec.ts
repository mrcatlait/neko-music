import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ComponentRef, provideZonelessChangeDetection } from '@angular/core'
import { PartiallyMocked } from 'vitest'

import { PlayIcon } from './play-icon'

import { TrackBuilder } from 'src/test-utils'
import { PlaybackStore, QueueStore } from '@/core/stores'
import { PLAYBACK_STATUS } from '@/shared/enums'

describe('PlayIcon', () => {
  let component: PlayIcon
  let componentRef: ComponentRef<PlayIcon>
  let fixture: ComponentFixture<PlayIcon>
  let playbackStoreMock: PartiallyMocked<PlaybackStore>
  let queueStoreMock: PartiallyMocked<QueueStore>

  beforeEach(() => {
    queueStoreMock = {
      currentTrack: vi.fn(),
    }

    playbackStoreMock = {
      queueStore: queueStoreMock as unknown as QueueStore,
      status: vi.fn(),
    }

    fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: PlaybackStore, useValue: playbackStoreMock }],
      imports: [PlayIcon],
    }).createComponent(PlayIcon)

    component = fixture.componentInstance
    componentRef = fixture.componentRef
  })

  describe('when different track is playing', () => {
    it('should show play_arrow icon', () => {
      // Arrange
      const differentTrack = new TrackBuilder().build()
      const currentTrack = new TrackBuilder().build()
      queueStoreMock.currentTrack?.mockReturnValue(differentTrack)
      playbackStoreMock.status?.mockReturnValue(PLAYBACK_STATUS.Playing)
      componentRef.setInput('trackId', currentTrack.id)

      // Act
      fixture.detectChanges()

      // Assert
      expect(component.icon()).toBe('play_arrow')
    })
  })

  describe('when current track is playing', () => {
    describe('when playback status is playing', () => {
      it('should show pause icon', () => {
        // Arrange
        const currentTrack = new TrackBuilder().build()
        queueStoreMock.currentTrack?.mockReturnValue(currentTrack)
        playbackStoreMock.status?.mockReturnValue(PLAYBACK_STATUS.Playing)
        componentRef.setInput('trackId', currentTrack.id)

        // Act
        fixture.detectChanges()

        // Assert
        expect(component.icon()).toBe('pause')
      })
    })

    describe('when playback status is paused', () => {
      it('should show play_arrow icon', () => {
        // Arrange
        const currentTrack = new TrackBuilder().build()
        queueStoreMock.currentTrack?.mockReturnValue(currentTrack)
        playbackStoreMock.status?.mockReturnValue(PLAYBACK_STATUS.Paused)
        componentRef.setInput('trackId', currentTrack.id)

        // Act
        fixture.detectChanges()

        // Assert
        expect(component.icon()).toBe('play_arrow')
      })
    })

    describe('when playback status is stopped', () => {
      it('should show play_arrow icon', () => {
        // Arrange
        const currentTrack = new TrackBuilder().build()
        queueStoreMock.currentTrack?.mockReturnValue(currentTrack)
        playbackStoreMock.status?.mockReturnValue(PLAYBACK_STATUS.Stopped)
        componentRef.setInput('trackId', currentTrack.id)

        // Act
        fixture.detectChanges()

        // Assert
        expect(component.icon()).toBe('play_arrow')
      })
    })

    describe('when playback status is loading', () => {
      it('should show play_arrow icon', () => {
        // Arrange
        const currentTrack = new TrackBuilder().build()
        queueStoreMock.currentTrack?.mockReturnValue(currentTrack)
        playbackStoreMock.status?.mockReturnValue(PLAYBACK_STATUS.Loading)
        componentRef.setInput('trackId', currentTrack.id)

        // Act
        fixture.detectChanges()

        // Assert
        expect(component.icon()).toBe('play_arrow')
      })
    })
  })
})
