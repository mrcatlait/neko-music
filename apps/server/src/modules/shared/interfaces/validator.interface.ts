export interface Validator<T> {
  validate(data: T): Promise<void> | void
}
