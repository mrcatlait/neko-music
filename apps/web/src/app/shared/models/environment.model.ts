export interface Environment {
  apiUrl: string
  /** Base URL for serving media assets (artwork, etc.). Defaults to apiUrl when omitted. */
  assetsUrl?: string
}
