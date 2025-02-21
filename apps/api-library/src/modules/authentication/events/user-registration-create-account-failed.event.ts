export class UserRegistrationCreateAccountFailedEvent {
  constructor(
    readonly userId: string,
    readonly roleId: string,
  ) {}
}
