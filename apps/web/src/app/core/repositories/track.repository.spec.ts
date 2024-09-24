import { TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { HttpClient, provideHttpClient } from '@angular/common/http'
import { of } from 'rxjs'

import { TrackRepository } from './track.repository'

import { PageOptionsDto, PageResponseDto, TrackDto } from '@core/dto'
import { environment } from '@environment'
import { API_URL } from '@core/tokens'

describe('TrackRepository', () => {
  let repository: TrackRepository
  let httpClient: HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TrackRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: environment.apiUrl },
      ],
    })

    repository = TestBed.inject(TrackRepository)
    httpClient = TestBed.inject(HttpClient)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should get popular tracks', () => {
    // Arrange
    const mockResponse: PageResponseDto<Partial<TrackDto>> = {
      data: [
        { id: '1', title: 'Remix 1' },
        { id: '2', title: 'Remix 2' },
      ],
      meta: { take: 2, offset: 2, itemCount: 2, pageCount: 1 },
    }

    vi.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse))

    // Act
    repository.getPopular().subscribe((remixes) => {
      // Assert
      expect(remixes).toEqual(mockResponse.data)
    })
  })

  it('should get tracks with page options', () => {
    // Arrange
    const pageOptions: PageOptionsDto = { take: 10, offset: 0 }
    const mockResponse: PageResponseDto<Partial<TrackDto>> = {
      data: [
        { id: '1', title: 'Remix 1' },
        { id: '2', title: 'Remix 2' },
      ],
      meta: { take: 2, offset: 2, itemCount: 2, pageCount: 1 },
    }

    vi.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse))

    // Act
    repository.get(pageOptions).subscribe((response) => {
      // Assert
      expect(response).toEqual(mockResponse)
    })
  })
})
