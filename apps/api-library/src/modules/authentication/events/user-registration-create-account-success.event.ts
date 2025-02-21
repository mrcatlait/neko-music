export class UserRegistrationCreateAccountSuccessEvent {
  constructor(
    readonly userId: string,
    readonly displayName: string,
  ) {}
}
