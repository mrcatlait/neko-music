export interface UseCase<T, R> {
  invoke(params: T): Promise<R>
}
