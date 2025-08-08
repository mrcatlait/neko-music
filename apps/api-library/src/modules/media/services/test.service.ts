import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { join } from 'path'
import { readFile } from 'fs/promises'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { StorageStrategy } from '../strategies/storage'
import { AudioTransformParameters, AudioTransformStrategy } from '../strategies/audio-transform'
import { FileUtilsService } from './file-utils.service'

import { EventBusService } from '@/modules/event-bus/services'

@Injectable()
export class TestService implements OnApplicationBootstrap {
  private readonly storageStrategy: StorageStrategy
  private readonly audioTransformStrategy: AudioTransformStrategy
  private readonly audioTransformPreset: AudioTransformParameters

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly fileUtilsService: FileUtilsService,
    private readonly eventBus: EventBusService,
  ) {
    this.storageStrategy = this.options.storageStrategy
    this.audioTransformStrategy = this.options.audioTransformStrategy
    this.audioTransformPreset = this.options.audioTransformPreset
  }

  async onApplicationBootstrap(): Promise<void> {
    const rootMediaDirectory = this.options.temporaryDirectory
    const testAudioPath = join(rootMediaDirectory, 'file_example_MP3_2MG.mp3')
    const testAudioBuffer = await readFile(testAudioPath)

    const randomUUID = crypto.randomUUID()

    const targetPath = join(rootMediaDirectory, randomUUID)

    this.fileUtilsService.createDirectory(targetPath)

    await this.audioTransformStrategy.transform(testAudioBuffer, targetPath, this.audioTransformPreset)

    this.fileUtilsService.deleteDirectory(targetPath)

    await this.eventBus.publish({ type: 'artwork', data: 'test' })
  }
}
