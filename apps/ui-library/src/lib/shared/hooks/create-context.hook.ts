import { getContext, setContext } from 'svelte'

export const createContext = <Type>() => {
  const CONTEXT_KEY = Symbol()

  return {
    get: () => getContext<Type>(CONTEXT_KEY),
    set: (context: Type) => setContext<Type>(CONTEXT_KEY, context),
  }
}
