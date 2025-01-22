import { NotFoundError } from 'elysia'
import { existsSync } from 'fs'
import { join } from 'path'

import { STREAM_PATH } from '../constants'

export class StreamingService {
  streamManifest(trackId: string): ReadableStream<Uint8Array> {
    const filePath = this.getManifestPath(trackId)
    return Bun.file(filePath).stream()
  }

  streamSegment(trackId: string, segmentId: string): ReadableStream<Uint8Array> {
    const filePath = this.getSegmentPath(trackId, segmentId)
    return Bun.file(filePath).stream()
  }

  private getManifestPath(trackId: string): string {
    const filePath = join(STREAM_PATH, 'tracks', trackId, 'manifest.mpd')

    if (!existsSync(filePath)) {
      throw new NotFoundError()
    }

    return filePath
  }

  private getSegmentPath(trackId: string, segmentId: string): string {
    const filePath = join(STREAM_PATH, 'tracks', trackId, segmentId)

    if (!existsSync(filePath)) {
      throw new NotFoundError()
    }

    return filePath
  }
}
