export enum PlaybackEventType {
  TrackSelected = 'setCurrentTrack',
  TrackLoaded = 'trackLoaded',
  TrackEnded = 'trackEnded',
  PlaybackStarted = 'playbackStarted',
  PlaybackPaused = 'playbackPaused',
  PlaybackTimeUpdated = 'playbackTimeUpdated',
  PlaybackTimeSeek = 'playbackTimeSeek',
  VolumeUpdated = 'volumeUpdated',
  MuteToggled = 'muteToggled',
}
