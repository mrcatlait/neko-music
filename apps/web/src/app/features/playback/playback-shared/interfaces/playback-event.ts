import { PlaybackEventType } from '../enums'

import { Track } from '@core/interfaces'

export interface PlaybackTimeUpdatedPayload {
  time: number
}

export interface PlaybackTimeSeekPayload {
  time: number
}

export interface VolumeUpdatedPayload {
  volume: number
}

export interface MuteToggledPayload {
  muted: boolean
}

export interface TrackSelectedPayload {
  track: Track
}

export interface PlaybackEventPayloadMap {
  [PlaybackEventType.TrackLoaded]: undefined
  [PlaybackEventType.TrackEnded]: undefined
  [PlaybackEventType.VolumeUpdated]: VolumeUpdatedPayload
  [PlaybackEventType.MuteToggled]: MuteToggledPayload
  [PlaybackEventType.PlaybackTimeUpdated]: PlaybackTimeUpdatedPayload
  [PlaybackEventType.PlaybackTimeSeek]: PlaybackTimeSeekPayload
  [PlaybackEventType.TrackSelected]: TrackSelectedPayload
  [PlaybackEventType.PlaybackStarted]: undefined
  [PlaybackEventType.PlaybackPaused]: undefined
}

export interface PlaybackEvent {
  type: PlaybackEventType
  payload: PlaybackEventPayloadMap[PlaybackEventType]
}
