import { IEvent, IEventHandler } from '../../interfaces'

export interface MessagingStrategy {
  onDestroy(): void
  onInit(): void
  publish(message: IEvent): Promise<void> | void
  subscribe(eventName: string, handler: IEventHandler<IEvent>): Promise<void> | void
}
