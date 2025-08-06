import { MessagingStrategy } from './strategies/messaging'

export interface EventBusModuleOptions {
  messagingStrategy: MessagingStrategy
}
