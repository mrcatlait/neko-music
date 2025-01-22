/* eslint-disable @typescript-eslint/no-floating-promises */
import { DockerContainer } from './docker-container'
import { logger } from './logger'

export abstract class ReadinessProbe {
  protected startupTimeout = 60000

  abstract waitUntilReady(container: DockerContainer): Promise<void>
}

export class LogReadinessProbe extends ReadinessProbe {
  constructor(private readonly message: RegExp) {
    super()
  }

  async waitUntilReady(container: DockerContainer): Promise<void> {
    logger.debug(`Waiting for log message ${this.message}`, { containerName: container.getName() })

    const command = Bun.spawn(['docker', 'logs', '-f', container.getName()], {
      stdout: 'pipe',
      stderr: 'ignore',
    })

    const processLogs = async (timeout: Timer, resolve: () => void) => {
      for await (const chunk of command.stdout) {
        const line = new TextDecoder().decode(chunk)
        if (this.message.test(line)) {
          command.kill()
          clearTimeout(timeout)
          logger.debug(`Log wait probe complete`, { containerName: container.getName() })
          resolve()
          return
        }
      }
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        command.kill()
        const message = `Log message "${this.message}" not received after ${this.startupTimeout}ms`
        logger.error(message, { containerName: container.getName() })
        reject(new Error(message))
      }, this.startupTimeout)

      processLogs(timeout, resolve)
    })
  }
}
