export interface AudioTransformOptions {
  readonly targetPath: string
  readonly sourceBuffer: Buffer
  readonly sourceFormat: string
}

export interface AudioTransformStrategy {
  transform(options: AudioTransformOptions): Promise<void>
}
