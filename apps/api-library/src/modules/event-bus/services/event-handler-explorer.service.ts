import { Injectable } from '@nestjs/common'
import { DiscoveryService } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

import { EVENT_HANDLER_METADATA } from '../constants'
import { IEventHandler } from '../interfaces'

interface EventHandlerInfo {
  event: string
  instance?: IEventHandler
}

@Injectable()
export class EventHandlerExplorerService {
  constructor(private readonly discoveryService: DiscoveryService) {}

  discover(): EventHandlerInfo[] {
    const providers: InstanceWrapper<IEventHandler>[] = this.discoveryService.getProviders({
      metadataKey: EVENT_HANDLER_METADATA,
    })
    const eventHandlers: EventHandlerInfo[] = []

    providers.forEach((wrapper) => {
      const { instance } = wrapper

      if (!instance) {
        return
      }

      if (!instance.constructor) {
        return
      }

      const event = Reflect.getMetadata(EVENT_HANDLER_METADATA, instance.constructor)

      if (!event) {
        return
      }

      eventHandlers.push({ event, instance })
    })

    return eventHandlers
  }
}
