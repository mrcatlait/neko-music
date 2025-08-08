import { applyDecorators, Injectable, InjectableOptions } from '@nestjs/common'
import { DiscoveryService } from '@nestjs/core'

export const EventHandlerInternal = DiscoveryService.createDecorator<string>()

export function EventHandler(event: string, options?: InjectableOptions) {
  return applyDecorators(Injectable(options), EventHandlerInternal(event))
}
