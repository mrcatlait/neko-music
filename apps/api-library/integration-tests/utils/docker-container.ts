import { $ } from 'bun'

import { CommandBuilder } from './command'
import { logger } from './logger'

export interface DockerContainerOptions {
  env?: string[]
  portBindings?: Record<number, number>
  image: string
}

export class DockerContainer {
  private readonly ports: Map<number, number> = new Map()
  private readonly containerName: string

  constructor(private readonly options: DockerContainerOptions) {
    const image = options.image.split(':')[0]
    const tag = options.image.split(':')[1]
    this.containerName = `neko-test-${image}-${tag}`

    if (options.portBindings) {
      Object.entries(options.portBindings).forEach(([host, container]) => {
        this.ports.set(Number(host), container)
      })
    }
  }

  async create() {
    logger.debug(`Creating container for image ${this.options.image}`)
    try {
      const portBindings = Array.from(this.ports.entries()).map(([host, container]) => `${host}:${container}`)

      const command = new CommandBuilder('docker')
        .add('container', 'create')
        .addFlag('--name', this.containerName)
        .addFlags('-e', this.options.env)
        .addFlags('-p', portBindings)
        .add(this.options.image)
        .build()

      await $`${command}`

      logger.debug(`Container created for image ${this.options.image}`, { containerName: this.containerName })
    } catch (error) {
      logger.error(`Failed to create container for image ${this.options.image}`, error)
      throw error
    }
  }

  async start() {
    try {
      logger.debug('Starting container', { containerName: this.containerName })
      await $`docker container start ${this.containerName}`
      logger.debug('Container started', { containerName: this.containerName })
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to start container: ${error.message}`, { containerName: this.containerName }, error)
      } else {
        logger.error(`Failed to start container`, { containerName: this.containerName }, error)
      }
      throw error
    }
  }

  async stop() {
    try {
      logger.debug('Stopping container', { containerName: this.containerName })
      await $`docker container stop ${this.containerName}`
      logger.debug('Container stopped', { containerName: this.containerName })
    } catch (error) {
      logger.error(`Failed to stop container`, { containerName: this.containerName }, error)
      throw error
    }
  }

  async remove() {
    try {
      logger.debug('Removing container', { containerName: this.containerName })
      await $`docker container rm ${this.containerName}`
      logger.debug('Container removed', { containerName: this.containerName })
    } catch (error) {
      logger.error(`Failed to remove container`, { containerName: this.containerName }, error)
      throw error
    }
  }

  getName(): string {
    return this.containerName
  }

  getOptions(): DockerContainerOptions {
    return this.options
  }

  getPorts(): Map<number, number> {
    return this.ports
  }
}
