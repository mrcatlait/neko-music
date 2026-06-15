import { ImportStrategy } from './strategies/import.strategy'

export type ImportModuleOptions = {
  /**
   * The import strategies to use.
   * @example [new YoutubeImportStrategy({ downloadDirectory: join(process.cwd(), 'media', 'import') })]
   */
  importStrategies: ImportStrategy[]
  /**
   * Number of days a discovery snapshot stays startable.
   * @default 7
   */
  discoveryTtlDays?: number
  /**
   * Global cap for concurrently running import jobs.
   * @default 1
   */
  maxConcurrentJobs?: number
  /**
   * Per-source caps for concurrently running jobs.
   * Key is dataSource (strategy key), value is max parallel jobs for that source.
   * @default {}
   */
  maxConcurrentJobsPerSource?: Record<string, number>
}
