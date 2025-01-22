import { DockerContainer } from './docker-container'

export class StartedContainer {
  constructor(
    private readonly host = 'localhost',
    private readonly container: DockerContainer,
  ) {}

  async stop(): Promise<void> {
    await this.container.stop()
    return this.container.remove()
  }

  getHost(): string {
    return this.host
  }

  getFirstMappedPort(): number {
    const firstBinding = this.container.getPorts().values().next().value

    if (!firstBinding) {
      throw new Error('No port bindings found')
    } else {
      return firstBinding
    }
  }

  getMappedPort(port: number): number {
    const binding = this.container.getPorts().get(port)

    if (!binding) {
      throw new Error(`No port binding found for :${port}`)
    }

    return binding
  }

  getName(): string {
    return this.container.getName()
  }

  getContainer(): DockerContainer {
    return this.container
  }
}
