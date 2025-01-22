import { Static, t } from 'elysia'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'

const envVariableSchema = t.Object({
  // Server
  PORT: t.Number(),

  // Database
  DATABASE_HOST: t.String(),
  DATABASE_PORT: t.Number(),
  DATABASE_USERNAME: t.String(),
  DATABASE_PASSWORD: t.String(),
  DATABASE_NAME: t.String(),

  // JWT
  JWT_SECRET: t.String(),
  JWT_REFRESH_SECRET: t.String(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: t.String(),
  JWT_TOKEN_EXPIRATION_TIME: t.String(),
  JWT_ISSUER: t.String(),
  JWT_AUDIENCE: t.String(),
})

export type Environment = Static<typeof envVariableSchema>

export class ConfigService {
  private readonly env: Environment

  constructor() {
    const envSource = { ...process.env }
    const typeCompiler = TypeCompiler.Compile(envVariableSchema)

    const preparedVariables = Value.Clean(
      envVariableSchema,
      Value.Convert(envVariableSchema, Value.Default(envVariableSchema, envSource)),
    )

    const isValid = typeCompiler.Check(preparedVariables)

    if (!isValid) {
      const errorMessage = [...typeCompiler.Errors(preparedVariables)].reduce((errors, e) => {
        const path = e.path.substring(1)
        return { ...errors, [path]: e.message }
      }, {})

      console.error('Invalid environment variables:', errorMessage)

      process.exit(1)
    }

    this.env = preparedVariables
  }

  get<Key extends keyof Environment>(key: Key): Environment[Key] {
    return this.env[key]
  }
}
