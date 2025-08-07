import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class ProcessArtistArtworkCron {
  private readonly logger = new Logger(this.constructor.name)

  // constructor(private readonly processingStrategyRegistry: ProcessingStrategyRegistry) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.debug('Processing artist artworks')
    // await this.processingStrategyRegistry.getStrategy('artist-artwork').process()
  }
}
