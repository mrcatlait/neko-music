import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import type { Database } from '../types'
import { DatabasePropagationService } from './database-propagation.service'

const { mockReaddirSync, mockReadFileSync } = vi.hoisted(() => ({
  mockReaddirSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}))

vi.mock('node:fs', () => ({
  readdirSync: mockReaddirSync,
  readFileSync: mockReadFileSync,
}))

class TestPropagationService extends DatabasePropagationService {
  tableName = 'test_migrations'
  scriptsFolder = '/test/scripts'
}

describe('DatabasePropagationService', () => {
  let database: Database<unknown>
  let service: TestPropagationService

  beforeEach(() => {
    database = {
      executeQuery: vi.fn(),
    } as unknown as Database<unknown>

    service = new TestPropagationService(database)
  })

  describe('executePendingScripts', () => {
    it('should skip execution when scripts folder is empty', async () => {
      // Arrange
      service.scriptsFolder = ''
      const createTableSpy = vi.spyOn(service, 'createTableIfNotExist')

      // Act
      await service.executePendingScripts()

      // Assert
      expect(createTableSpy).not.toHaveBeenCalled()
      expect(database.executeQuery).not.toHaveBeenCalled()
    })

    it('should create table and execute each pending script', async () => {
      // Arrange
      const scriptsFolder = '/test/scripts'
      service.scriptsFolder = scriptsFolder
      service.tableName = 'migrations'
      const pendingScripts = ['001_init.sql', '002_add.sql']

      vi.spyOn(service, 'createTableIfNotExist').mockResolvedValue(undefined)
      vi.spyOn(service, 'getPendingScripts').mockResolvedValue(pendingScripts)
      const executeScriptSpy = vi.spyOn(service, 'executeScript').mockResolvedValue(undefined)

      mockReadFileSync.mockImplementation((path) => {
        if (path === join(scriptsFolder, '001_init.sql')) return 'CREATE TABLE foo;'
        if (path === join(scriptsFolder, '002_add.sql')) return 'ALTER TABLE foo;'
        return ''
      })

      // Act
      await service.executePendingScripts()

      // Assert
      expect(service.createTableIfNotExist).toHaveBeenCalledWith('migrations')
      expect(service.getPendingScripts).toHaveBeenCalledWith(scriptsFolder, 'migrations')
      expect(executeScriptSpy).toHaveBeenCalledTimes(2)
      expect(executeScriptSpy).toHaveBeenNthCalledWith(1, '001_init.sql', 'CREATE TABLE foo;', 'migrations')
      expect(executeScriptSpy).toHaveBeenNthCalledWith(2, '002_add.sql', 'ALTER TABLE foo;', 'migrations')
      expect(mockReadFileSync).toHaveBeenCalledWith(join(scriptsFolder, '001_init.sql'), 'utf-8')
      expect(mockReadFileSync).toHaveBeenCalledWith(join(scriptsFolder, '002_add.sql'), 'utf-8')
    })
  })

  describe('getPendingScripts', () => {
    it('should return scripts that have not been executed', async () => {
      // Arrange
      vi.spyOn(service, 'getAllScripts').mockReturnValue(['001_a.sql', '002_b.sql', '003_c.sql'])
      vi.spyOn(service, 'loadExecutedScripts').mockResolvedValue(['001_a.sql'])

      // Act
      const result = await service.getPendingScripts('/scripts', 'migrations')

      // Assert
      expect(result).toEqual(['002_b.sql', '003_c.sql'])
    })

    it('should return all scripts when none have been executed', async () => {
      // Arrange
      vi.spyOn(service, 'getAllScripts').mockReturnValue(['001_a.sql'])
      vi.spyOn(service, 'loadExecutedScripts').mockResolvedValue([])

      // Act
      const result = await service.getPendingScripts('/scripts', 'migrations')

      // Assert
      expect(result).toEqual(['001_a.sql'])
    })
  })

  describe('getAllScripts', () => {
    it('should return list with single .sql file', () => {
      // Arrange
      mockReaddirSync.mockReturnValue(['test.sql'])

      // Act
      const result = service.getAllScripts('/scripts')

      // Assert
      expect(result).toEqual(['test.sql'])
      expect(readdirSync).toHaveBeenCalledWith('/scripts')
    })

    it('should return sorted list of .sql files', () => {
      // Arrange
      mockReaddirSync.mockReturnValue(['010_last.sql', '2_middle.sql', '1_first.sql'])

      // Act
      const result = service.getAllScripts('/scripts')

      // Assert
      expect(result).toEqual(['1_first.sql', '2_middle.sql', '010_last.sql'])
      expect(readdirSync).toHaveBeenCalledWith('/scripts')
    })

    it('should ignore non-SQL files', () => {
      // Arrange
      mockReaddirSync.mockReturnValue(['test.sql', 'readme.md'])

      // Act
      const result = service.getAllScripts('/scripts')

      // Assert
      expect(result).toEqual(['test.sql'])
      expect(readdirSync).toHaveBeenCalledWith('/scripts')
    })
  })

  describe('executeScript', () => {
    it('should execute SQL and record the script name', async () => {
      // Arrange
      vi.mocked(database.executeQuery).mockResolvedValue({ rows: [] })
      const insertSpy = vi.spyOn(service, 'insertExecutedScript').mockResolvedValue(undefined)

      // Act
      await service.executeScript('001_init.sql', 'CREATE TABLE foo;', 'migrations')

      // Assert
      expect(database.executeQuery).toHaveBeenCalled()
      expect(insertSpy).toHaveBeenCalledWith('001_init.sql', 'migrations')
    })
  })

  describe('loadExecutedScripts', () => {
    it('should return script names from the tracking table', async () => {
      // Arrange
      vi.mocked(database.executeQuery).mockResolvedValue({
        rows: [{ name: '002_b.sql' }, { name: '001_a.sql' }],
      })

      // Act
      const result = await service.loadExecutedScripts('migrations')

      // Assert
      expect(result).toEqual(['002_b.sql', '001_a.sql'])
      expect(database.executeQuery).toHaveBeenCalled()
    })
  })

  describe('insertExecutedScript', () => {
    it('should insert the script name into the tracking table', async () => {
      // Arrange
      vi.mocked(database.executeQuery).mockResolvedValue({ rows: [] })

      // Act
      await service.insertExecutedScript('001_init.sql', 'migrations')

      // Assert
      expect(database.executeQuery).toHaveBeenCalled()
    })
  })

  describe('createTableIfNotExist', () => {
    it('should create the tracking table when it does not exist', async () => {
      // Arrange
      vi.mocked(database.executeQuery).mockResolvedValue({ rows: [] })
      vi.spyOn(service, 'hasTable').mockResolvedValue(false)

      // Act
      await service.createTableIfNotExist('migrations')

      // Assert
      expect(database.executeQuery).toHaveBeenCalledOnce()
    })

    it('should not create the tracking table when it already exists', async () => {
      // Arrange
      vi.spyOn(service, 'hasTable').mockResolvedValue(true)

      // Act
      await service.createTableIfNotExist('migrations')

      // Assert
      expect(database.executeQuery).not.toHaveBeenCalled()
    })
  })

  describe('getCurrentSchema', () => {
    it('should return the current database schema', async () => {
      // Arrange
      vi.mocked(database.executeQuery).mockResolvedValue({
        rows: [{ current_schema: 'public' }],
      })

      // Act
      const result = await service.getCurrentSchema()

      // Assert
      expect(result).toBe('public')
    })
  })

  describe('hasTable', () => {
    it('should return true when the table exists in the current schema', async () => {
      // Arrange
      vi.spyOn(service, 'getCurrentSchema').mockResolvedValue('public')
      vi.mocked(database.executeQuery).mockResolvedValue({ rows: [{ table_name: 'migrations' }] })

      // Act
      const result = await service.hasTable('migrations')

      // Assert
      expect(result).toBe(true)
      expect(database.executeQuery).toHaveBeenCalledOnce()
    })

    it('should return false when the table does not exist', async () => {
      // Arrange
      vi.spyOn(service, 'getCurrentSchema').mockResolvedValue('public')
      vi.mocked(database.executeQuery).mockResolvedValue({ rows: [] })

      // Act
      const result = await service.hasTable('migrations')

      // Assert
      expect(result).toBe(false)
    })
  })
})
