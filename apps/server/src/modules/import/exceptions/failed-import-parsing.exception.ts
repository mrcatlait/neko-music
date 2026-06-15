/**
 * Thrown when a failed to parse an import target.
 */
export class FailedImportParsingException extends Error {
  constructor(message: string) {
    super(`Failed to parse import target: ${message}`)
  }
}
