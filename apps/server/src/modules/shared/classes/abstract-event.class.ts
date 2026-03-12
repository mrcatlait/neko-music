export abstract class AbstractEvent<Payload> {
  static readonly event: string

  constructor(readonly payload: Payload) {}
}
