import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

import { EventHandlerExplorerService } from './event-handler-explorer.service'
import { IEvent } from '../interfaces'
import { EventBusModuleOptions } from '../types'
import { EVENT_BUS_MODULE_OPTIONS } from '../constants'
import { MessagingStrategy } from '../strategies/messaging'

@Injectable()
export class EventBusService implements OnModuleInit {
  private readonly messagingStrategy: MessagingStrategy

  constructor(
    private readonly eventHandlerExplorerService: EventHandlerExplorerService,
    @Inject(EVENT_BUS_MODULE_OPTIONS) private readonly options: EventBusModuleOptions,
  ) {
    this.messagingStrategy = this.options.messagingStrategy
  }

  async onModuleInit(): Promise<void> {
    const eventHandlers = this.eventHandlerExplorerService.discover()

    for (const eventHandler of eventHandlers) {
      if (!eventHandler.instance?.handle) {
        continue
      }

      await this.messagingStrategy.subscribe(eventHandler.event, eventHandler.instance)
    }
  }

  async publish(event: IEvent): Promise<void> {
    await this.messagingStrategy.publish(event)
  }
}
