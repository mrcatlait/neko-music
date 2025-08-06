import { applyDecorators, SetMetadata, Injectable, InjectableOptions } from '@nestjs/common'

import { EVENT_HANDLER_METADATA } from '../constants'

export function EventHandler(event: string, options?: InjectableOptions) {
  return applyDecorators(Injectable(options), SetMetadata(EVENT_HANDLER_METADATA, event))
}
