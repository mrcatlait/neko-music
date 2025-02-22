import { Injectable } from '@nestjs/common'
import { ICommand, ofType, Saga } from '@nestjs/cqrs'
import { map, Observable } from 'rxjs'

import {
  UserRegistrationAssignRoleFailedEvent,
  UserRegistrationCreateAccountFailedEvent,
  UserRegistrationDefaultRoleNotFoundEvent,
} from '../events'
import { DeleteUserLoginDataCommand } from '../commands'

import { RevokeRoleCommand } from '@modules/authorization/commands'

@Injectable()
export class UserRegistrationSaga {
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
