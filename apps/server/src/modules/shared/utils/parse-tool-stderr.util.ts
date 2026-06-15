/**
 * Extracts the most relevant error line from external tool stderr (e.g. yt-dlp, ffmpeg).
 */
export function parseToolStderr(stderr: string): string | null {
  const lines = stderr.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

  const errorLines = lines.filter((line) => line.startsWith('ERROR:'))

  if (errorLines.length === 0) {
    return null
  }

  const lastError = errorLines[errorLines.length - 1]

  return lastError
    .replace(/^ERROR:\s*/, '')
    .replace(/^\[[\w-]+\]\s+[\w-]+:\s*/, '')
    .trim()
}
