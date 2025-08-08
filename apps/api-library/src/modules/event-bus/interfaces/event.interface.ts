export interface IEvent<Data = unknown> {
  type: string
  data: Data
}
