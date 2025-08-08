import { IEventHandler } from '@/modules/event-bus'
import { EventHandler } from '@/modules/event-bus/decorators'

@EventHandler('artwork')
export class ArtworkEvent implements IEventHandler<string> {
  handle(data: string) {
    console.log('ArtworkEvent', data)
  }
}
