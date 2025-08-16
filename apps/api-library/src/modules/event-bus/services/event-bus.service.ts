import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { DiscoveryService } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

import { IEvent, IEventHandler } from '../interfaces'
import { EventBusModuleOptions } from '../types'
import { MessagingStrategy } from '../strategies/messaging'
import { EVENT_BUS_MODULE_OPTIONS } from '../tokens'
import { EventHandlerInternal } from '../decorators'

@Injectable()
export class EventBusService implements OnApplicationBootstrap {
  private readonly messagingStrategy: MessagingStrategy

  constructor(
    @Inject(EVENT_BUS_MODULE_OPTIONS) private readonly options: EventBusModuleOptions,
    private readonly discoveryService: DiscoveryService,
  ) {
    this.messagingStrategy = this.options.messagingStrategy
  }

  async onApplicationBootstrap(): Promise<void> {
    const providers: InstanceWrapper<IEventHandler<IEvent>>[] = this.discoveryService.getProviders({
      metadataKey: EventHandlerInternal.KEY,
    })

    for (const provider of providers) {
      const event: IEvent | undefined = this.discoveryService.getMetadataByDecorator(EventHandlerInternal, provider)

      if (!event) {
        continue
      }

      await this.messagingStrategy.subscribe(event, provider.instance)
    }
  }

  async publish(event: IEvent): Promise<void> {
    await this.messagingStrategy.publish(event)
  }
}
