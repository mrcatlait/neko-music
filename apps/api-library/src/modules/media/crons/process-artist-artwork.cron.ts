import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ProcessingStrategyRegistry } from '../strategies/processing'

@Injectable()
export class ProcessArtistArtworkCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly processingStrategyRegistry: ProcessingStrategyRegistry) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Processing artist artworks')
    await this.processingStrategyRegistry.getStrategy('artist-artwork').process()
  }
}
