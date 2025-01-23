import { DockerImage } from './docker-image'
import { DockerContainer, DockerContainerOptions } from './docker-container'
import { ReadinessProbe } from './readiness-probe'
import { StartedContainer } from './abstract-started-container'

type Environment = { [key in string]: string }

type PortWithBinding = {
  host: number
  container: number
}

type PortWithOptionalBinding = number | PortWithBinding

export class GenericContainer {
  private readonly containerOptions: DockerContainerOptions

  private readonly imageName: string

  private environment: Record<string, string> = {}
  private readinessProbe: ReadinessProbe | null = null

  constructor(image: string) {
    this.imageName = image

    this.containerOptions = {
      image: this.imageName,
    }
  }

  async start(): Promise<StartedContainer> {
    const image = new DockerImage(this.imageName)

    await image.pull()

    const container = new DockerContainer(this.containerOptions)
    await container.create()

    try {
      await container.start()

      if (this.readinessProbe) {
        await this.readinessProbe.waitUntilReady(container)
      }
    } catch {
      await container.stop()
      await container.remove()

      process.exit(1)
    }

    return new StartedContainer('localhost', container)
  }

  withEnvironment(environment: Environment): this {
    this.environment = { ...this.environment, ...environment }
    this.containerOptions.env = [
      ...(this.containerOptions.env ?? []),
      ...Object.entries(environment).map(([key, value]) => `${key}=${value}`),
    ]

    return this
  }

  withPorts(...ports: PortWithOptionalBinding[]): this {
    const portBindings: Record<number, number> = {}

    for (const exposedPort of ports) {
      if (this.hasHostBinding(exposedPort)) {
        portBindings[exposedPort.host] = exposedPort.container
      } else {
        portBindings[exposedPort] = exposedPort
      }
    }

    this.containerOptions.portBindings = {
      ...(this.containerOptions.portBindings ?? {}),
      ...portBindings,
    }

    return this
  }

  withReadinessProbe(readinessProbe: ReadinessProbe): this {
    this.readinessProbe = readinessProbe
    return this
  }

  private hasHostBinding(port: PortWithOptionalBinding): port is PortWithBinding {
    return typeof port === 'object' && 'host' in port
  }
}
