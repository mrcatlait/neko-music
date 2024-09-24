import { Matcher } from '@pact-foundation/pact'

export type PactMatcher<Type> = [Type] extends [object]
  ? {
      [Key in keyof Type]: PactMatcher<Type[Key]>
    }
  : Type | Matcher<Type>
