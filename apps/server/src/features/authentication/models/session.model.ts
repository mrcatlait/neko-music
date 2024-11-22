export interface Session {
  user: {
    id: string
    username: string
  }
  permissions: string[]
}
