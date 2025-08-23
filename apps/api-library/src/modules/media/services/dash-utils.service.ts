import { Injectable } from '@nestjs/common'

import { FileUtilsService } from './file-utils.service'

@Injectable()
export class DashUtilsService {
  constructor(private readonly fileUtilsService: FileUtilsService) {}

  getDurationFromManifest(manifestPath: string): number {
    const manifest = this.fileUtilsService.readFileSync(manifestPath)

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
