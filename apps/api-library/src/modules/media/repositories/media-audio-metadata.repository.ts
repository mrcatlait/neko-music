import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { MediaAudioMetadataEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class MediaAudioMetadataRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends MediaAudioMetadataEntity>(metadata: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."MediaAudioMetadata" ("assetId", "bitrate", "sampleRate", "channels", "codec", "duration")
      VALUES (${metadata.assetId}, ${metadata.bitrate}, ${metadata.sampleRate}, ${metadata.channels}, ${metadata.codec}, ${metadata.duration})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findOne<Type extends MediaAudioMetadataEntity>(assetId: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."MediaAudioMetadata"
      WHERE "assetId" = ${assetId}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  update(metadata: MediaAudioMetadataEntity, sql?: Sql): Promise<MediaAudioMetadataEntity> {
    return (sql ?? this.databaseService.sql)<MediaAudioMetadataEntity[]>`
      UPDATE "media"."MediaAudioMetadata" 
      SET "bitrate" = ${metadata.bitrate}, "sampleRate" = ${metadata.sampleRate}, "channels" = ${metadata.channels}, "codec" = ${metadata.codec}, "duration" = ${metadata.duration}
      WHERE "assetId" = ${metadata.assetId}
      RETURNING *
    `.then((result) => result.at(0)!)
  }
}
