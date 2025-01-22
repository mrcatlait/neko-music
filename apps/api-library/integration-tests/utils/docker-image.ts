import { $ } from 'bun'

import { logger } from './logger'

export class DockerImage {
  constructor(private readonly imageName: string) {}

  async pull(): Promise<void> {
    if (await this.exists()) {
      logger.debug(`Image ${this.imageName} already exists`)
      return
    }

    logger.debug(`Pulling image ${this.imageName}`)
    try {
      await $`docker pull ${this.imageName}`
      logger.debug(`Image ${this.imageName} pulled successfully`)
    } catch (error) {
      logger.error(`Failed to pull image ${this.imageName}`, error)
      throw error
    }
  }

  async exists(): Promise<boolean> {
    logger.debug(`Checking if image ${this.imageName} exists`)

    try {
      const { stdout } = await $`docker images -q ${this.imageName}`
      logger.debug(`Checked if image ${this.imageName} exists`)
      return stdout.toString().trim() !== ''
    } catch (error) {
      // if (err instanceof Error && err.message.toLowerCase().includes("no such image")) {
      //   log.debug(`Checked if image exists "${imageName.string}"`);
      //   return false;
      // }

      logger.error(`Failed to check if image ${this.imageName} exists`, error)
      return false
    }
  }
}
