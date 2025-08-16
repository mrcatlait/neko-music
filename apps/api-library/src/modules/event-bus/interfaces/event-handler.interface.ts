/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IEvent {}

/**
 * Represents an event handler.
 */
export interface IEventHandler<T extends IEvent = any> {
  /**
   * Handles an event.
   * @param event The event to handle.
   */
  handle(event: T): any
}
