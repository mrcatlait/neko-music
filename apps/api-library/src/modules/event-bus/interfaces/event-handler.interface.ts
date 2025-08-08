/**
 * Represents an event handler.
 */
export interface IEventHandler<TData = unknown, TResult = void> {
  /**
   * Handles an event.
   * @param event The event to handle.
   */
  handle(data: TData): TResult
}
