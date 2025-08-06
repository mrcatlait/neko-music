import { IEvent, IEventHandler } from '../../interfaces'

export interface MessagingStrategy {
  onDestroy(): void
  onInit(): void
  publish(message: IEvent): Promise<void> | void
  subscribe(message: IEvent, handler: IEventHandler): Promise<void> | void
}
