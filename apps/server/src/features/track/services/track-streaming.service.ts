import { join } from 'node:path'
import { NotFoundError } from 'elysia'

import { STREAM_PATH } from '@common/constants'

export class TrackStreamingService {
  streamManifest(trackId: string): Promise<ReadableStream<Uint8Array>> {
    const filePath = join(STREAM_PATH, 'tracks', trackId, 'manifest.mpd')

    return this.getFileStream(filePath)
  }

  streamSegment(trackId: string, segmentId: string): Promise<ReadableStream<Uint8Array>> {
    const filePath = join(STREAM_PATH, 'tracks', trackId, segmentId)

    return this.getFileStream(filePath)
  }

  private async getFileStream(filePath: string): Promise<ReadableStream<Uint8Array>> {
    const file = Bun.file(filePath)

    const fileExists = await file.exists()

    if (!fileExists) {
      throw new NotFoundError()
    }

    return file.stream()
  }
}
