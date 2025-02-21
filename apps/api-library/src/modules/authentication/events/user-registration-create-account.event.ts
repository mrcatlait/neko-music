export class UserRegistrationCreateAccountEvent {
  constructor(
    readonly userId: string,
    readonly roleId: string,
    readonly displayName: string,
  ) {}
}
