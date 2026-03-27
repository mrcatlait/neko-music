export enum MediaStatus {
  /**
   * Media was never uploaded or processed
   */
  Empty = 'EMPTY',

  /**
   * Media was uploaded but not processed
   */
  Uploaded = 'UPLOADED',

  /**
   * Media is being processed
   */
  Processing = 'PROCESSING',

  /**
   * Media is ready for use
   */
  Ready = 'READY',

  /**
   * Media processing failed
   */
  Failed = 'FAILED',
}
