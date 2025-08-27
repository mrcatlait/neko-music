import { Pipe, PipeTransform } from '@angular/core'

/**
 * Formats a duration in seconds to a string in the format of HH:MM:SS
 * @param duration - The duration in seconds
 * @returns The formatted duration
 * @example
 * ```typescript
 * {{ 3600 | duration }} // Returns: '1:00:00'
 * {{ 60 | duration }} // Returns: '1:00'
 * {{ 1 | duration }} // Returns: '0:01'
 * ```
 */
@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(duration: number): string {
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
}
