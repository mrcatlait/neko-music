import { filter, Subject, takeUntil } from 'rxjs'

import { MessagingStrategy } from './messaging.strategy'
import { IEvent, IEventHandler } from '../../interfaces'

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

  publish<T extends IEvent>(event: T) {
    this.streamSubject.next(event)
  }

  subscribe(eventName: string, eventHandler: IEventHandler<unknown>) {
    this.stream$
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e.type === eventName),
        filter(notNullOrUndefined),
      )
      .subscribe((e) => eventHandler.handle(e.data))
  }
}
