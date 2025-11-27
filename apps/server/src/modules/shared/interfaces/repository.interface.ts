export interface Repository<T> {
  create(entity: T): Promise<T>
  createMany(entities: T[]): Promise<T[]>
  update(entity: T): Promise<T>
  updateMany(entities: T[]): Promise<T[]>
  delete(id: string): Promise<void>
  deleteMany(ids: string[]): Promise<void>
  findOne(id: string): Promise<T | undefined>
  findMany(ids: string[]): Promise<T[]>
  findAll(): Promise<T[]>
}
