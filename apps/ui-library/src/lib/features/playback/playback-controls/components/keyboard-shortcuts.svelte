<script lang="ts">
  import { PLAYBACK_STATUS } from '@/shared/enums'
  import { getPlaybackState } from '@/shared/contexts'

  const state = getPlaybackState()

  function handleKeyDown(event: KeyboardEvent) {
    // Prevent shortcuts when typing in input fields
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (event.key) {
      // Basic playback controls
      case ' ':
        event.preventDefault()
        handlePlayPause()
        break
      case 'MediaPlayPause':
      case 'PlayPause':
        event.preventDefault()
        handlePlayPause()
        break
      case 'MediaPlay':
        event.preventDefault()
        state.play()
        break
      case 'MediaPause':
        event.preventDefault()
        state.pause()
        break
      case 'MediaStop':
        event.preventDefault()
        state.pause()
        state.seek(0)
        break

      // Track navigation
      case 'MediaTrackNext':
      case 'MediaNextTrack':
        event.preventDefault()
        state.next()
        break
      case 'MediaTrackPrevious':
      case 'MediaPreviousTrack':
        event.preventDefault()
        state.previous()
        break

      // Seeking controls
      case 'ArrowRight':
        event.preventDefault()
        if (event.shiftKey) {
          state.seek(state.currentTime + 30) // 30 seconds
        } else if (event.ctrlKey || event.metaKey) {
          state.seek(state.currentTime + 60) // 1 minute
        } else {
          state.seek(state.currentTime + 10) // 10 seconds
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (event.shiftKey) {
          state.seek(state.currentTime - 30) // 30 seconds
        } else if (event.ctrlKey || event.metaKey) {
          state.seek(state.currentTime - 60) // 1 minute
        } else {
          state.seek(state.currentTime - 10) // 10 seconds
        }
        break
      case 'Home':
        event.preventDefault()
        state.seek(0)
        break
      case 'End':
        event.preventDefault()
        if (state.currentTrack) {
          state.seek(state.currentTrack.duration)
        }
        break

      // Volume controls
      case 'ArrowUp':
        event.preventDefault()
        if (event.shiftKey) {
          state.setVolume(Math.min(1, state.volume + 0.05)) // 5% increment
        } else {
          state.setVolume(Math.min(1, state.volume + 0.1)) // 10% increment
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (event.shiftKey) {
          state.setVolume(Math.max(0, state.volume - 0.05)) // 5% increment
        } else {
          state.setVolume(Math.max(0, state.volume - 0.1)) // 10% increment
        }
        break
      case 'MediaVolumeUp':
        event.preventDefault()
        state.setVolume(Math.min(1, state.volume + 0.1))
        break
      case 'MediaVolumeDown':
        event.preventDefault()
        state.setVolume(Math.max(0, state.volume - 0.1))
        break
      case 'MediaVolumeMute':
        event.preventDefault()
        state.toggleMute()
        break

      // Playback mode controls
      case 'm':
      case 'M':
        event.preventDefault()
        state.toggleMute()
        break
      case 'r':
      case 'R':
        event.preventDefault()
        state.toggleRepeat()
        break
      case 's':
      case 'S':
        event.preventDefault()
        state.toggleShuffle()
        break

      // Track navigation (letter keys)
      case 'n':
      case 'N':
        event.preventDefault()
        state.next()
        break
      case 'p':
      case 'P':
        event.preventDefault()
        state.previous()
        break
      default:
        break
    }
  }

  function handlePlayPause() {
    if (state.status === PLAYBACK_STATUS.Playing) {
      state.pause()
    } else {
      state.play()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
