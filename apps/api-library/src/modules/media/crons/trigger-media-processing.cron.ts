import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ProcessMediaEvent } from '../events'

import { EventBusService } from '@/modules/event-bus/services'

@Injectable()
export class TriggerMediaProcessingCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly eventBus: EventBusService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Triggering media processing')
    await this.eventBus.publish(new ProcessMediaEvent())
  }
}
