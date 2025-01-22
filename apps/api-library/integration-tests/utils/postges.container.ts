import { StartedContainer } from './abstract-started-container'
import { GenericContainer } from './generic-container'
import { LogReadinessProbe } from './readiness-probe'

export class PostgreSqlContainer extends GenericContainer {
  private readonly password = 'test'
  private readonly username = 'test'
  private readonly database = 'test'
  private readonly port = 5432

  constructor() {
    super('postgres:16-alpine')

    this.withEnvironment({
      POSTGRES_PASSWORD: this.password,
      POSTGRES_USER: this.username,
      POSTGRES_DB: this.database,
    })
      .withPorts(this.port)
      .withReadinessProbe(new LogReadinessProbe(/database system is ready to accept connections/))
  }

  override async start(): Promise<StartedPostgreSqlContainer> {
    return new StartedPostgreSqlContainer(await super.start(), this.port, this.database, this.username, this.password)
  }
}

export class StartedPostgreSqlContainer extends StartedContainer {
  constructor(
    startedContainer: StartedContainer,
    private readonly port: number,
    private readonly database: string,
    private readonly username: string,
    private readonly password: string,
  ) {
    super(startedContainer.getHost(), startedContainer.getContainer())
  }

  getPort(): number {
    return this.port
  }

  getDatabase(): string {
    return this.database
  }

  getUsername(): string {
    return this.username
  }

  getPassword(): string {
    return this.password
  }
}
