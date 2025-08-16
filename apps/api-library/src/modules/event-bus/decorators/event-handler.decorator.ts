import { applyDecorators, Injectable, InjectableOptions } from '@nestjs/common'
import { DiscoveryService } from '@nestjs/core'

import { IEvent } from '../interfaces'

export const EventHandlerInternal = DiscoveryService.createDecorator<IEvent>()

export function EventHandler(event: IEvent, options?: InjectableOptions) {
  return applyDecorators(Injectable(options), EventHandlerInternal(event))
}
