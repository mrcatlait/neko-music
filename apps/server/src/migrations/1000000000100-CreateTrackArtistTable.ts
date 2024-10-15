import { MigrationInterface, QueryRunner } from 'typeorm'

import { TrackArtistTable } from '@tables'

export class CreateTrackArtistTable1000000000100 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(TrackArtistTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TrackArtistTable.table)
  }
}
