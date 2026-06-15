import { Test } from '@nestjs/testing'

import { DatabaseService } from './database.service'
import { DatabaseMigrationService } from './database-migration.service'
import { DatabaseSeedService } from './database-seed.service'
import type { Database, DatabaseModuleOptions } from '../types'
import { DATABASE, DATABASE_MODULE_OPTIONS } from '../database.tokens'
import { FailedDatabaseConnectException } from '../exceptions'

const defaultOptions: DatabaseModuleOptions = {
  host: 'localhost',
  port: 5432,
  username: 'u',
  password: 'p',
  database: 'db',
  retryInterval: 5,
  maxRetries: 2,
  runMigrations: false,
  runSeeds: false,
}

async function createService(options: Partial<DatabaseModuleOptions> = {}) {
  const moduleRef = await Test.createTestingModule({
    providers: [
      DatabaseService,
      {
        provide: DatabaseMigrationService,
        useValue: { executePendingScripts: vi.fn() },
      },
      {
        provide: DatabaseSeedService,
        useValue: { executePendingScripts: vi.fn() },
      },
      {
        provide: DATABASE_MODULE_OPTIONS,
        useValue: { ...defaultOptions, ...options },
      },
      {
        provide: DATABASE,
        useValue: { executeQuery: vi.fn().mockResolvedValue({ rows: [1] }) },
      },
    ],
  }).compile()
  return {
    service: moduleRef.get(DatabaseService),
    migration: moduleRef.get(DatabaseMigrationService),
    seed: moduleRef.get(DatabaseSeedService),
    database: moduleRef.get<Database<unknown>>(DATABASE),
  }
}

describe('DatabaseService', () => {
  describe('connect', () => {
    it('should connect to the database', async () => {
      // Arrange
      const { service, database } = await createService()
      vi.mocked(database.executeQuery).mockResolvedValue({ rows: [1] })

      // Act
      await service.connect()

      // Assert
      expect(database.executeQuery).toHaveBeenCalled()
    })

    it('should connect to the database after retries', async () => {
      // Arrange
      const MAX_ATTEMPTS = 2
      const { service, database } = await createService()
      let attempts = 1
      vi.mocked(database.executeQuery).mockImplementation(() => {
        if (attempts < MAX_ATTEMPTS) {
          attempts++
          return Promise.reject(new Error('Failed to connect to the database'))
        }

        return Promise.resolve({ rows: [1] })
      })

      // Act
      await service.connect()

      // Assert
      expect(database.executeQuery).toHaveBeenCalledTimes(MAX_ATTEMPTS)
    })

    it('should throw an error if the database is not connected', async () => {
      // Arrange
      const { service, database } = await createService()
      vi.mocked(database.executeQuery).mockRejectedValue(new Error())

      // Act & Assert
      await expect(service.connect()).rejects.toThrow(FailedDatabaseConnectException)
    })
  })

  describe('onApplicationBootstrap', () => {
    it('should run migrations when runMigrations is true', async () => {
      // Arrange
      const { service, migration, seed } = await createService({
        runMigrations: true,
        migrations: '/path/to/migrations', // optional for this service
      })

      // Act
      await service.onApplicationBootstrap()

      // Assert
      expect(migration.executePendingScripts).toHaveBeenCalledOnce()
      expect(seed.executePendingScripts).not.toHaveBeenCalled()
    })

    it('should run seeds when runSeeds is true', async () => {
      // Arrange
      const { service, migration, seed } = await createService({
        runSeeds: true,
        seeds: '/path/to/seeds',
      })

      // Act
      await service.onApplicationBootstrap()

      // Assert
      expect(seed.executePendingScripts).toHaveBeenCalledOnce()
      expect(migration.executePendingScripts).not.toHaveBeenCalled()
    })

    it('should run both when both flags are true', async () => {
      // Arrange
      const { service, migration, seed } = await createService({
        runMigrations: true,
        runSeeds: true,
      })

      // Act
      await service.onApplicationBootstrap()

      // Assert
      expect(migration.executePendingScripts).toHaveBeenCalledOnce()
      expect(seed.executePendingScripts).toHaveBeenCalledOnce()
    })

    it('should not run migrations or seeds when flags are false', async () => {
      // Arrange
      const { service, migration, seed } = await createService({
        migrations: '/still/ignored',
        seeds: '/still/ignored',
        runMigrations: false,
        runSeeds: false,
      })

      // Act
      await service.onApplicationBootstrap()

      // Assert
      expect(migration.executePendingScripts).not.toHaveBeenCalled()
      expect(seed.executePendingScripts).not.toHaveBeenCalled()
    })
  })
})
