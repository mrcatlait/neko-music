import { DynamicModule, Provider, Type } from '@nestjs/common'

import { AsyncModuleOptions, AsyncModuleOptionsFactory } from '../interfaces'

export abstract class CoreModuleWithOptions<Options> {
  protected abstract module: Type<CoreModuleWithOptions<Options>>
  protected abstract optionsToken: string
  protected providers: Provider[] = []
  protected exports: Provider[] = []
  protected controllers: Type<any>[] = []

  forRoot(options: Options): DynamicModule {
    const optionsProvider: Provider = {
      provide: this.optionsToken,
      useValue: options,
    }

    const providers: Provider[] = [optionsProvider, ...this.providers]

    return {
      module: this.module,
      controllers: this.controllers,
      providers,
      exports: [...this.exports],
    }
  }

  forRootAsync(options: AsyncModuleOptions<Options>): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options)

    const providers: Provider[] = [...asyncProviders, ...this.providers, ...(options.extraProviders || [])]

    return {
      module: this.module,
      imports: options.imports,
      controllers: this.controllers,
      providers,
      exports: [...this.exports],
    }
  }

  private createAsyncProviders(options: AsyncModuleOptions<Options>): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    const useClass = options.useClass as Type<AsyncModuleOptionsFactory<Options>>

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ]
  }

  private createAsyncOptionsProvider(options: AsyncModuleOptions<Options>): Provider {
    if (options.useFactory) {
      return {
        provide: this.optionsToken,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    const inject = [(options.useClass || options.useExisting) as Type<AsyncModuleOptionsFactory<Options>>]

    return {
      provide: this.optionsToken,
      useFactory: (optionsFactory: AsyncModuleOptionsFactory<Options>) => optionsFactory.createOptions(),
      inject,
    }
  }
}
