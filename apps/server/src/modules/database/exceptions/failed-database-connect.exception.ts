export class FailedDatabaseConnectException extends Error {
  constructor() {
    super('Failed to connect to the database')
  }
}
