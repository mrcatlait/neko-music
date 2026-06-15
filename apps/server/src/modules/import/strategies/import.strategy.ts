import { DiscoverResult, IngestTrackResult } from '../types'

export interface ImportMethod {
  key: string
  name: string
  description: string
}

export interface ImportStrategy {
  /**
   * The import method supported by this strategy.
   */
  readonly method: ImportMethod

  /**
   * Normalize source references so dedupe is stable.
   */
  normalizeSourceRef(sourceRef: string): string

  /**
   * Normalize source item references so discovered/ingested items are canonical.
   */
  normalizeSourceItemRef(sourceItemRef: string): string

  /**
   * Validate if the source reference is a valid input for the import strategy
   * @param sourceRef - The source reference
   */
  validateSourceRef(sourceRef: string): boolean

  /**
   * Discover the tracks for the import strategy
   * @param sourceRef - The source reference
   */
  discoverTracks(sourceRef: string): Promise<DiscoverResult> | DiscoverResult

  /**
   * Ingest a single track
   * @param sourceItemRef - The source item reference
   */
  ingestTrack(sourceItemRef: string): Promise<IngestTrackResult> | IngestTrackResult
}
