import { TestBed } from '@angular/core/testing'
import { Meta, Title } from '@angular/platform-browser'
import { PartiallyMocked } from 'vitest'

import { SeoService } from './seo.service'

import { environment } from '@environment'

describe('SeoService', () => {
  let seoService: SeoService
  let titleMock: PartiallyMocked<Title>
  let metaMock: PartiallyMocked<Meta>

  beforeEach(() => {
    titleMock = {
      setTitle: vi.fn(),
    }

    metaMock = {
      updateTag: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [SeoService, { provide: Title, useValue: titleMock }, { provide: Meta, useValue: metaMock }],
    })

    seoService = TestBed.inject(SeoService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('setTitle', () => {
    it('should set the title with the application name', () => {
      // Arrange
      const appName = environment.applicationName

      // Act
      seoService.setTitle('Test Title')

      // Assert
      expect(titleMock.setTitle).toHaveBeenCalledWith(`Test Title - ${appName}`)
    })

    it('should set the title to the default application name when no title is provided', () => {
      // Arrange
      const appName = environment.applicationName

      // Act
      seoService.setTitle()

      // Assert
      expect(titleMock.setTitle).toHaveBeenCalledWith(appName)
    })
  })

  describe('resetTitle', () => {
    it('should reset the title to the application name', () => {
      // Arrange
      const appName = environment.applicationName

      // Act
      seoService.resetTitle()

      // Assert
      expect(titleMock.setTitle).toHaveBeenCalledWith(appName)
    })
  })

  describe('setDocumentDescription', () => {
    it('should update the document description', () => {
      // Arrange
      const description = 'This is a test description.'

      // Act
      seoService.setDocumentDescription(description)

      // Assert
      expect(metaMock.updateTag).toHaveBeenCalledWith({ name: 'description', content: description })
    })
  })
})
