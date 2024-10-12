import { computed, signal } from '@angular/core'
import { Observable, take } from 'rxjs'

import { StateModel } from '@core/models'
import { FetchStatus } from '@core/enum'

interface EntityStateModel<T> {
  data: T | null
  status: FetchStatus
  error: string | null
}

export abstract class EntityState<Entity, FetchPayload> implements StateModel<EntityStateModel<Entity>> {
  readonly data = signal<Entity | null>(null)
  readonly status = signal(FetchStatus.Pending)
  readonly error = signal<string | null>(null)

  readonly loading = computed(() => this.status() === FetchStatus.Loading)

  protected cache = false

  protected abstract fetchFn(payload: FetchPayload): Observable<Entity>

  fetch(payload: FetchPayload): void {
    if (this.cache && this.data()) {
      this.status.set(FetchStatus.Success)
      return
    }

    this.status.set(FetchStatus.Loading)

    this.fetchFn(payload)
      .pipe(take(1))
      .subscribe({
        next: (response) => this.fetchSuccess({ data: response }),
        error: (error) => this.fetchError({ error }),
      })
  }

  private fetchSuccess(payload: { data: Entity }): void {
    this.data.set(payload.data)
    this.status.set(FetchStatus.Success)
  }

  private fetchError(payload: { error: Error }): void {
    this.error.set(payload.error.message)
    this.status.set(FetchStatus.Error)
  }
}
