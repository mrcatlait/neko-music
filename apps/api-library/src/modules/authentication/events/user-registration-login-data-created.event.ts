export class UserRegistrationLoginDataCreatedEvent {
  constructor(
    readonly displayName: string,
    readonly userId: string,
  ) {}
}
