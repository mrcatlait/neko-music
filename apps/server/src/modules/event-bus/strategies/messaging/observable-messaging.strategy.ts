import { filter, Subject, takeUntil } from 'rxjs'

import { MessagingStrategy } from './messaging.strategy'
import { IEvent, IEventHandler } from '../../interfaces'

type EventClass = new (...args: unknown[]) => IEvent

export function notNullOrUndefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null
}

export class ObservableMessagingStrategy implements MessagingStrategy {
  private readonly streamSubject = new Subject<IEvent>()
  private readonly stream$ = this.streamSubject.asObservable()

  private readonly destroySubject = new Subject<void>()
  private readonly destroy$ = this.destroySubject.asObservable()

  onInit() {
    // Do nothing
  }

  onDestroy() {
    this.destroySubject.next()
    this.destroySubject.complete()
    this.streamSubject.complete()
  }

  publish(event: IEvent) {
    this.streamSubject.next(event)
  }

  subscribe(event: EventClass, eventHandler: IEventHandler<IEvent>) {
    this.stream$
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => this.isEventOfType(e, event)),
        filter(notNullOrUndefined),
      )
      .subscribe((e) => eventHandler.handle(e))
  }

  private isEventOfType(event: IEvent, eventClass: EventClass): boolean {
    return event.constructor.name === eventClass.name
  }
}
