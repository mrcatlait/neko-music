import { filter, Subject, takeUntil } from 'rxjs'

import { MessagingStrategy } from './messaging.strategy'
import { IEventHandler } from '../../interfaces'

interface Event {
  type: string
}

export function notNullOrUndefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null
}

export class ObservableMessagingStrategy implements MessagingStrategy {
  private readonly streamSubject = new Subject<Event>()
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

  publish<T extends Event>(event: T) {
    this.streamSubject.next(event)
  }

  subscribe<T extends Event>(event: T, eventHandler: IEventHandler<T>) {
    this.stream$
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e.type === event.type),
        filter(notNullOrUndefined),
      )
      .subscribe((e) => eventHandler.handle(e as T))
  }
}
