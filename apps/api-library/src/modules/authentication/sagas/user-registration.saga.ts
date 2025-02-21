import { Injectable } from '@nestjs/common'
import { CommandBus, ICommand, ofType, QueryBus, Saga } from '@nestjs/cqrs'
import { catchError, from, map, mergeMap, Observable, of } from 'rxjs'

import {
  UserRegistrationAssignRoleEvent,
  UserRegistrationAssignRoleFailedEvent,
  UserRegistrationCreateAccountEvent,
  UserRegistrationCreateAccountFailedEvent,
  UserRegistrationCreateAccountSuccessEvent,
  UserRegistrationDefaultRoleNotFoundEvent,
  UserRegistrationLoginDataCreatedEvent,
} from '../events'
import { CreateUserLoginDataCommand, DeleteUserLoginDataCommand } from '../commands'

import { GetDefaultRoleQuery } from '@modules/authorization/queries'
import { AssignRoleCommand, RevokeRoleCommand } from '@modules/authorization/commands'

@Injectable()
export class UserRegistrationSaga {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Saga()
  readonly loginDataCreated = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRegistrationLoginDataCreatedEvent),
      mergeMap((event) =>
        from(this.queryBus.execute(new GetDefaultRoleQuery())).pipe(
          map((defaultRole) => new UserRegistrationAssignRoleEvent(event.userId, defaultRole.id, event.displayName)),
          catchError(() => of(new UserRegistrationDefaultRoleNotFoundEvent(event.userId))),
        ),
      ),
    )
  }

  @Saga()
  readonly assignRole = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRegistrationAssignRoleEvent),
      mergeMap((event) =>
        from(this.commandBus.execute(new AssignRoleCommand(event.userId, event.roleId))).pipe(
          map(() => new UserRegistrationCreateAccountEvent(event.userId, event.roleId, event.displayName)),
          catchError(() => of(new UserRegistrationAssignRoleFailedEvent(event.userId))),
        ),
      ),
    )
  }

  @Saga()
  readonly createAccount = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRegistrationCreateAccountEvent),
      mergeMap((event) =>
        from(this.commandBus.execute(new CreateUserLoginDataCommand(event.userId, event.displayName))).pipe(
          map(() => new UserRegistrationCreateAccountSuccessEvent(event.userId, event.displayName)),
          catchError(() => of(new UserRegistrationCreateAccountFailedEvent(event.userId, event.roleId))),
        ),
      ),
    )
  }

  @Saga()
  readonly compensateAssignRole = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRegistrationCreateAccountFailedEvent),
      map((event) => new RevokeRoleCommand(event.userId, event.roleId)),
    )
  }

  @Saga()
  readonly compensateCreateUserLoginData = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(
        UserRegistrationDefaultRoleNotFoundEvent,
        UserRegistrationAssignRoleFailedEvent,
        UserRegistrationCreateAccountFailedEvent,
      ),
      map((event) => new DeleteUserLoginDataCommand(event.userId)),
    )
  }
}
