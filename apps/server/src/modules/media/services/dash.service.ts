import { Injectable } from '@nestjs/common'
import { readFileSync } from 'node:fs'

@Injectable()
export class DashService {
  /**
   * Get the duration of a DASH manifest file
   * @param manifestPath - The path to the DASH manifest file
   * @returns The duration of the DASH manifest file in seconds
   */
  getDurationFromManifest(manifestPath: string): number {
    const manifest = readFileSync(manifestPath, 'utf-8')

    const match = manifest.match(/(mediaPresentationDuration=")(.+)"/)

    if (!match) {
      throw new Error('Manifest does not contain mediaPresentationDuration')
    }

    const duration = this.parseISO8601Duration(match[2])

    const hours = duration.hours ? Number(duration.hours) * 60 * 60 : 0
    const minutes = duration.minutes ? Number(duration.minutes) * 60 : 0
    const seconds = duration.seconds ? Math.floor(Number(duration.seconds)) : 0

    return hours + minutes + seconds
  }

  /**
   * Parse an ISO 8601 duration string into a duration object
   * @param iso8601Duration - The ISO 8601 duration string
   * @returns The duration object
   */
  parseISO8601Duration(iso8601Duration: string) {
    const iso8601DurationRegex =
      /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/

    const matches = iso8601DurationRegex.exec(iso8601Duration)

    if (!matches) {
      throw new Error('Invalid ISO 8601 duration')
    }

    return {
      years: matches[2],
      months: matches[3],
      weeks: matches[4],
      days: matches[5],
      hours: matches[6],
      minutes: matches[7],
      seconds: matches[8],
    }
  }
}
