import { Context } from '../utils'
import { AuthDSL } from './auth.dsl'

export let auth: AuthDSL

beforeEach(() => {
  const context = new Context()

  auth = new AuthDSL(context)
})
