/**
 * Formats a duration in seconds to a string in the format of HH:MM:SS
 * @param duration - The duration in seconds
 * @returns The formatted duration
 * @example
 * ```typescript
 * formatDuration(3600) // Returns: '1:00:00'
 * formatDuration(60) // Returns: '1:00'
 * formatDuration(1) // Returns: '0:01'
 * ```
 */
export const formatDuration = (duration: number) => {
  if (duration <= 0) return '0:00'

  let totalSeconds = Math.floor(duration)
  const seconds = totalSeconds % 60
  totalSeconds = Math.floor(totalSeconds / 60)
  const minutes = totalSeconds % 60
  const hours = Math.floor(totalSeconds / 60)

  const secondsStr = seconds < 10 ? '0' + seconds : seconds.toString()
  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString()

  if (hours > 0) {
    return hours + ':' + minutesStr + ':' + secondsStr
  }

  return minutes + ':' + secondsStr
}
