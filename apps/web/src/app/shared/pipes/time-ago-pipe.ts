import { Pipe, PipeTransform } from '@angular/core'

/**
 * Formats a date to a string in the format of "a moment ago", "1 hour ago", "1 day ago", etc.
 * @param value - The date to format
 * @returns The formatted date
 * @example
 * ```ts
 * {{ new Date() | timeAgo }} // Returns: 'a moment ago'
 * ```
 */
@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    const dateMs = date.getTime()

    if (Number.isNaN(dateMs)) {
      return 'undefined'
    }

    const now = new Date()

    const seconds = (dateMs - now.getTime()) / 1000

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' })

    const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'week', seconds: 604800 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 },
    ]

    for (const interval of intervals) {
      const delta = seconds / interval.seconds

      if (Math.abs(delta) >= 1) {
        return rtf.format(Math.round(delta), interval.unit)
      }
    }

    return 'a moment ago'
  }
}
