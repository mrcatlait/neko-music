import { IEvent, IEventHandler } from '../../interfaces'

export interface MessagingStrategy {
  onDestroy(): void
  onInit(): void
  publish(event: IEvent): Promise<void> | void
  subscribe(event: IEvent, handler: IEventHandler<IEvent>): Promise<void> | void
}
