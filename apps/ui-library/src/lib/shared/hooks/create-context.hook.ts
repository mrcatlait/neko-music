import { browser } from '$app/environment'
import { getContext, setContext } from 'svelte'

export const createContext = <Type>() => {
  const CONTEXT_KEY = Symbol()

  return {
    get: () => {
      const context = getContext<Type>(CONTEXT_KEY)
      if (!context && browser) {
        throw new Error('Context must be used within its Provider component')
      }
      return context
    },
    set: (context: Type) => setContext<Type>(CONTEXT_KEY, context),
  }
}
