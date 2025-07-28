export interface ProcessingStrategy {
  process(): Promise<void>
}
