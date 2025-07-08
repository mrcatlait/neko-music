<script lang="ts">
  import type { Track } from '../../models'

  let { tracks } = $props<{ tracks: Track[] }>()

  const trackCount = tracks.length
  const totalDuration = tracks.reduce((acc: number, track: Track) => acc + track.duration, 0)

  const durationText = (() => {
    if (totalDuration <= 0) return '0 minutes'

    const minutes = Math.floor(totalDuration / 60)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}${
        remainingMinutes > 0 ? ` ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}` : ''
      }`
    }

    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  })()
</script>

{trackCount}
{trackCount === 1 ? 'track' : 'tracks'}, {durationText}
