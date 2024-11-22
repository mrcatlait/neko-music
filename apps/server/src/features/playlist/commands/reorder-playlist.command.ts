export interface ReorderPlaylistCommand {
  userId: string
  playlistId: string
  rangeStart: number
  rangeEnd: number
  insertBefore: number
}
