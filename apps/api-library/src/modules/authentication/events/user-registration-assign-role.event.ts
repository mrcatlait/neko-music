export class UserRegistrationAssignRoleEvent {
  constructor(
    readonly userId: string,
    readonly roleId: string,
    readonly displayName: string,
  ) {}
}
