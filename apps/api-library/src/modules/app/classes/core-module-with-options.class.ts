import { DynamicModule, Provider, Type } from '@nestjs/common'

import { AsyncModuleOptions, AsyncModuleOptionsFactory } from '../interfaces'

export abstract class CoreModuleWithOptions {
  protected static module: Type<CoreModuleWithOptions>
  protected static optionsToken: string
  protected static providers: Provider[] = []
  protected static exports: Provider[] = []
  protected static controllers: Type<unknown>[] = []

  static forRoot(options: unknown): DynamicModule {
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

  static forRootAsync(options: AsyncModuleOptions<unknown>): DynamicModule {
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

  private static createAsyncProviders(options: AsyncModuleOptions<unknown>): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    const useClass = options.useClass as Type<AsyncModuleOptionsFactory<unknown>>

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: AsyncModuleOptions<unknown>): Provider {
    if (options.useFactory) {
      return {
        provide: this.optionsToken,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    const inject = [(options.useClass || options.useExisting) as Type<AsyncModuleOptionsFactory<unknown>>]

    return {
      provide: this.optionsToken,
      useFactory: (optionsFactory: AsyncModuleOptionsFactory<unknown>) => optionsFactory.createOptions(),
      inject,
    }
  }
}
