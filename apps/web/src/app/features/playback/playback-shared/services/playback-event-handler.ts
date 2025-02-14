import { Injectable } from '@angular/core'

import {
  MuteToggledPayload,
  PlaybackEvent,
  PlaybackEventPayloadMap,
  PlaybackTimeSeekPayload,
  PlaybackTimeUpdatedPayload,
  TrackSelectedPayload,
  VolumeUpdatedPayload,
} from '../interfaces'
import { PlaybackEventType } from '../enums'

type Listener<Type extends PlaybackEventType> = (payload: PlaybackEventPayloadMap[Type]) => void

@Injectable()
export class PlaybackEventHandler {
  private readonly listeners = new Map<PlaybackEventType, Set<Listener<any>>>()

  dispatch(event: PlaybackEvent): void {
    const callbacks = this.listeners.get(event.type)

    if (!callbacks) {
      return
    }

    callbacks.forEach((listener) => listener(event.payload))
  }

  trackLoaded(): void {
    this.dispatch({ type: PlaybackEventType.TrackLoaded, payload: undefined })
  }

  trackEnded(): void {
    this.dispatch({ type: PlaybackEventType.TrackEnded, payload: undefined })
  }

  timeUpdated(event: PlaybackTimeUpdatedPayload): void {
    this.dispatch({ type: PlaybackEventType.PlaybackTimeUpdated, payload: event })
  }

  timeSeek(event: PlaybackTimeSeekPayload): void {
    this.dispatch({ type: PlaybackEventType.PlaybackTimeSeek, payload: event })
  }

  volumeUpdated(event: VolumeUpdatedPayload): void {
    this.dispatch({ type: PlaybackEventType.VolumeUpdated, payload: event })
  }

  muteToggled(event: MuteToggledPayload): void {
    this.dispatch({ type: PlaybackEventType.MuteToggled, payload: event })
  }

  trackSelected(event: TrackSelectedPayload): void {
    this.dispatch({ type: PlaybackEventType.TrackSelected, payload: event })
  }

  playbackStarted(): void {
    this.dispatch({ type: PlaybackEventType.PlaybackStarted, payload: undefined })
  }

  playbackPaused(): void {
    this.dispatch({ type: PlaybackEventType.PlaybackPaused, payload: undefined })
  }

  on<Type extends PlaybackEventType>(eventType: Type, listener: Listener<Type>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }

    const callbacks = this.listeners.get(eventType)
    callbacks!.add(listener)

    return () => {
      callbacks!.delete(listener)

      if (callbacks!.size === 0) {
        this.listeners.delete(eventType)
      }
    }
  }
}
