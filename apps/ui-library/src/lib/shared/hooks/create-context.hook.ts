import { browser } from '$app/environment'
import { getContext, setContext } from 'svelte'

export const createContext = <Type>(key: string) => {
  return {
    get(): Type {
      const context = getContext<Type>(key)
      if (!context && browser) {
        throw new Error('Context must be used within its Provider component')
      }
      return context
    },

    set(context: Type): void {
      setContext<Type>(key, context)
    },
  }
}
