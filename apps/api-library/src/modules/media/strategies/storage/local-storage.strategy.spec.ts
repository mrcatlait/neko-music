import { Test } from '@nestjs/testing'
import { existsSync, mkdirSync, unlink, writeFile } from 'fs'
import { dirname } from 'path'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import { StorageProvider } from '../../enums'
import { LocalStorageStrategy } from './local-storage.strategy'
import { MediaUploadOptions, MediaDeleteOptions } from './storage.strategy'

type Callback = (error: Error | null | string) => void

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFile: vi.fn(),
  unlink: vi.fn(),
}))

// Mock path module
vi.mock('path', () => ({
  dirname: vi.fn(),
}))

describe('LocalStorageStrategy', () => {
  let strategy: LocalStorageStrategy
  let mockWriteFile: ReturnType<typeof vi.fn>
  let mockUnlink: ReturnType<typeof vi.fn>
  let mockExistsSync: ReturnType<typeof vi.fn>
  let mockMkdirSync: ReturnType<typeof vi.fn>
  let mockDirname: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    // Arrange
    const module = await Test.createTestingModule({
      providers: [LocalStorageStrategy],
    }).compile()

    strategy = module.get(LocalStorageStrategy)

    // Get mocked functions
    mockWriteFile = vi.mocked(writeFile)
    mockUnlink = vi.mocked(unlink)
    mockExistsSync = vi.mocked(existsSync)
    mockMkdirSync = vi.mocked(mkdirSync)
    mockDirname = vi.mocked(dirname)

    // Reset all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('upload', () => {
    const mockFile = {
      buffer: Buffer.from('test file content'),
      fieldname: 'file',
      originalname: 'test.mp3',
      encoding: '7bit',
      mimetype: 'audio/mpeg',
      size: 1024,
    }

    const mockUploadOptions: MediaUploadOptions = {
      file: mockFile,
      fileName: '/uploads/test/test.mp3',
    }

    describe('when uploading a valid file', () => {
      it('should upload file successfully when directory exists', async () => {
        // Arrange
        mockDirname.mockReturnValue('/uploads/test')
        mockExistsSync.mockReturnValue(true)
        mockWriteFile.mockImplementation((path, data, callback: Callback) => {
          callback(null)
        })

        // Act
        const result = await strategy.upload(mockUploadOptions)

        // Assert
        expect(result).toEqual({
          storageProvider: StorageProvider.LOCAL,
          storagePath: '/uploads/test/test.mp3',
          publicUrl: '/media//uploads/test/test.mp3',
        })
        expect(mockDirname).toHaveBeenCalledWith('/uploads/test/test.mp3')
        expect(mockExistsSync).toHaveBeenCalledWith('/uploads/test')
        expect(mockMkdirSync).not.toHaveBeenCalled()
        expect(mockWriteFile).toHaveBeenCalledWith('/uploads/test/test.mp3', mockFile.buffer, expect.any(Function))
      })

      it('should create directory and upload file when directory does not exist', async () => {
        // Arrange
        mockDirname.mockReturnValue('/uploads/test')
        mockExistsSync.mockReturnValue(false)
        mockWriteFile.mockImplementation((path, data, callback: Callback) => {
          callback(null)
        })

        // Act
        const result = await strategy.upload(mockUploadOptions)

        // Assert
        expect(result).toEqual({
          storageProvider: StorageProvider.LOCAL,
          storagePath: '/uploads/test/test.mp3',
          publicUrl: '/media//uploads/test/test.mp3',
        })
        expect(mockDirname).toHaveBeenCalledWith('/uploads/test/test.mp3')
        expect(mockExistsSync).toHaveBeenCalledWith('/uploads/test')
        expect(mockMkdirSync).toHaveBeenCalledWith('/uploads/test', { recursive: true })
        expect(mockWriteFile).toHaveBeenCalledWith('/uploads/test/test.mp3', mockFile.buffer, expect.any(Function))
      })
    })

    describe('when uploading fails', () => {
      it('should throw error when file buffer is missing', async () => {
        // Arrange
        const invalidFile = { ...mockFile, buffer: undefined }
        const invalidOptions: MediaUploadOptions = {
          file: invalidFile,
          fileName: '/uploads/test/test.mp3',
        }

        // Act & Assert
        await expect(strategy.upload(invalidOptions)).rejects.toThrow('File buffer is required')
      })

      it('should throw error when writeFile fails', async () => {
        // Arrange
        mockDirname.mockReturnValue('/uploads/test')
        mockExistsSync.mockReturnValue(true)
        const writeError = new Error('Write failed')
        mockWriteFile.mockImplementation((path, data, callback: Callback) => {
          callback(writeError)
        })

        // Act & Assert
        await expect(strategy.upload(mockUploadOptions)).rejects.toThrow('Local storage upload failed: Write failed')
      })

      it('should throw error when mkdirSync fails', async () => {
        // Arrange
        mockDirname.mockReturnValue('/uploads/test')
        mockExistsSync.mockReturnValue(false)
        const mkdirError = new Error('Directory creation failed')
        mockMkdirSync.mockImplementation(() => {
          throw mkdirError
        })

        // Act & Assert
        await expect(strategy.upload(mockUploadOptions)).rejects.toThrow(
          'Local storage upload failed: Directory creation failed',
        )
      })

      it('should handle unknown error types', async () => {
        // Arrange
        mockDirname.mockReturnValue('/uploads/test')
        mockExistsSync.mockReturnValue(true)
        mockWriteFile.mockImplementation((path, data, callback: Callback) => {
          callback('String error')
        })

        // Act & Assert
        await expect(strategy.upload(mockUploadOptions)).rejects.toThrow('Local storage upload failed: Unknown error')
      })
    })
  })

  describe('delete', () => {
    const mockDeleteOptions: MediaDeleteOptions = {
      fileName: '/uploads/test/test.mp3',
    }

    describe('when deleting a file successfully', () => {
      it('should delete file successfully', async () => {
        // Arrange
        mockUnlink.mockImplementation((path, callback: Callback) => {
          callback(null)
        })

        // Act
        await strategy.delete(mockDeleteOptions)

        // Assert
        expect(mockUnlink).toHaveBeenCalledWith('/uploads/test/test.mp3', expect.any(Function))
      })
    })

    describe('when deletion fails', () => {
      it('should handle file not found error gracefully', async () => {
        // Arrange
        const notFoundError = new Error('File not found') as NodeJS.ErrnoException
        notFoundError.code = 'ENOENT'
        mockUnlink.mockImplementation((path, callback: Callback) => {
          callback(notFoundError)
        })

        // Act
        await expect(strategy.delete(mockDeleteOptions)).resolves.toBeUndefined()

        // Assert
        expect(mockUnlink).toHaveBeenCalledWith('/uploads/test/test.mp3', expect.any(Function))
      })

      it('should throw error for other deletion failures', async () => {
        // Arrange
        const deleteError = new Error('Permission denied') as NodeJS.ErrnoException
        deleteError.code = 'EACCES'
        mockUnlink.mockImplementation((path, callback: Callback) => {
          callback(deleteError)
        })

        // Act & Assert
        await expect(strategy.delete(mockDeleteOptions)).rejects.toThrow(
          'Local storage deletion failed: Permission denied',
        )
      })

      it('should handle unknown error types during deletion', async () => {
        // Arrange
        mockUnlink.mockImplementation((path, callback: Callback) => {
          callback('String error')
        })

        // Act & Assert
        await expect(strategy.delete(mockDeleteOptions)).rejects.toThrow('Local storage deletion failed: Unknown error')
      })
    })
  })

  describe('integration scenarios', () => {
    it('should handle upload and delete workflow', async () => {
      // Arrange
      const mockFile = {
        buffer: Buffer.from('test content'),
        fieldname: 'file',
        originalname: 'test.mp3',
        encoding: '7bit',
        mimetype: 'audio/mpeg',
        size: 1024,
      }

      const uploadOptions: MediaUploadOptions = {
        file: mockFile,
        fileName: '/uploads/test/test.mp3',
      }

      const deleteOptions: MediaDeleteOptions = {
        fileName: '/uploads/test/test.mp3',
      }

      mockDirname.mockReturnValue('/uploads/test')
      mockExistsSync.mockReturnValue(false)
      mockWriteFile.mockImplementation((path, data, callback: Callback) => {
        callback(null)
      })
      mockUnlink.mockImplementation((path, callback: Callback) => {
        callback(null)
      })

      // Act - Upload
      const uploadResult = await strategy.upload(uploadOptions)

      // Assert - Upload
      expect(uploadResult.storageProvider).toBe(StorageProvider.LOCAL)
      expect(uploadResult.storagePath).toBe('/uploads/test/test.mp3')
      expect(mockMkdirSync).toHaveBeenCalledWith('/uploads/test', { recursive: true })

      // Act - Delete
      await strategy.delete(deleteOptions)

      // Assert - Delete
      expect(mockUnlink).toHaveBeenCalledWith('/uploads/test/test.mp3', expect.any(Function))
    })
  })
})
