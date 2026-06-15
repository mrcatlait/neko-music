import { execFile, execSync, type ExecException } from 'node:child_process'
import { promisify } from 'node:util'
import { satisfies, valid } from 'semver'

import { parseToolStderr } from '../utils/parse-tool-stderr.util'

const execFileAsync = promisify(execFile)

interface RuntimeOptions {
  /**
   * The name of the binary to run.
   */
  binaryName: string
  /**
   * The supported version ranges of the external tool.
   * @example ['>=1.0.0']
   */
  supportedVersionRanges: string[]
  /**
   * The arguments to pass to the version command.
   * @example ['--version']
   */
  versionCommandArgs: string[]
  /**
   * The maximum buffer size for the runtime.
   * @example 64 * 1024 * 1024 // (64MB)
   */
  maxBuffer: number
}

/**
 * A class that represents a runtime.
 */
export class Runtime {
  protected readonly binaryName: string
  protected readonly supportedVersionRanges: string[]
  protected readonly versionCommandArgs: string[]
  protected readonly maxBuffer: number

  constructor(options: RuntimeOptions) {
    this.binaryName = options.binaryName
    this.supportedVersionRanges = options.supportedVersionRanges
    this.versionCommandArgs = options.versionCommandArgs
    this.maxBuffer = options.maxBuffer

    this.validateRuntime()
  }

  /**
   * Runs the runtime with the given arguments.
   * @param args - The arguments to pass to the runtime.
   * @returns The stdout of the runtime.
   */
  run(args: string[]): string {
    const command = `${this.binaryName} ${args.join(' ')}`

    const result = execSync(command, {
      stdio: 'pipe',
      maxBuffer: this.maxBuffer,
    })

    return result.toString()
  }

  /**
   * Runs the runtime without blocking the Node.js event loop.
   * @param args - The arguments to pass to the runtime.
   * @returns The stdout of the runtime.
   */
  async runAsync(args: string[]): Promise<string> {
    try {
      const { stdout } = await execFileAsync(this.binaryName, args, {
        maxBuffer: this.maxBuffer,
      })

      return stdout.toString()
    } catch (error) {
      throw this.toRuntimeError(error)
    }
  }

  private toRuntimeError(error: unknown): Error {
    const execError = error as ExecException

    if (execError.stderr) {
      let stderr: string | undefined

      if (typeof execError.stderr === 'string') {
        stderr = execError.stderr
      } else {
        stderr = Buffer.from(execError.stderr).toString()
      }

      const parsedMessage = stderr ? parseToolStderr(stderr) : null

      if (parsedMessage) {
        return new Error(parsedMessage)
      }
    }

    if (error instanceof Error) {
      return error
    }

    return new Error('External tool execution failed')
  }

  /**
   * Validates whether the external tool is available and supported.
   */
  private validateRuntime(): void {
    let rawVersion: string

    try {
      rawVersion = this.run(this.versionCommandArgs).trim()
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Runtime "${this.binaryName}" is not available: ${reason}`)
    }

    const normalizedVersion = this.normalizeVersion(rawVersion)

    const isSupported = this.supportedVersionRanges.every((range) =>
      satisfies(normalizedVersion, range, { includePrerelease: true }),
    )

    if (!isSupported) {
      throw new Error(
        `Runtime "${this.binaryName}" version "${normalizedVersion}" does not satisfy required ranges: ${this.supportedVersionRanges.join(', ')}.`,
      )
    }
  }

  /**
   * Normalizes the version of the external tool.
   * @param version - The version of the external tool.
   * @returns The normalized version.
   */
  private normalizeVersion(version: string): string {
    // yt-dlp uses calendar versions (e.g. 2026.03.17), so we normalize into semver.
    const calendarVersionMatch = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/)

    if (calendarVersionMatch) {
      const year = Number(calendarVersionMatch[1])
      const month = Number(calendarVersionMatch[2])
      const day = Number(calendarVersionMatch[3])

      return `${year}.${month}.${day}`
    }

    const validatedVersion = valid(version.trim())

    if (!validatedVersion) {
      throw new Error(`Runtime "${this.binaryName}" returned invalid version "${version}".`)
    }

    return validatedVersion
  }
}
