import { TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { HttpClient, provideHttpClient } from '@angular/common/http'
import { of } from 'rxjs'

import { TrackRepository } from './track.repository'

import { PageOptionsDto, PageResponseDto, TrackDto } from '@core/dto'
import { environment } from '@environment'
import { API_URL } from '@core/tokens'
import { Track } from '@core/models'
import * as trackMapper from '@core/mappers/track.mapper'

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
    const mockTrackDtos: TrackDto[] = [
      { id: '1', title: 'Track 1', images: [], artists: [], duration: 180, genres: [] },
      { id: '2', title: 'Track 2', images: [], artists: [], duration: 200, genres: [] },
    ]
    const mockResponse: PageResponseDto<TrackDto> = {
      data: mockTrackDtos,
      meta: { take: 2, offset: 0, itemCount: 2, pageCount: 1 },
    }
    const expectedTracks: Track[] = mockTrackDtos.map(trackMapper.mapTrackDtoToModel)

    vi.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse))
    vi.spyOn(trackMapper, 'mapTrackDtoToModel')

    // Act
    repository.getPopular().subscribe((tracks) => {
      // Assert
      expect(tracks).toEqual(expectedTracks)
      expect(trackMapper.mapTrackDtoToModel).toHaveBeenCalledTimes(2)
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/tracks/popular`, {
        params: { take: 12, offset: 0 },
      })
    })
  })

  it('should get tracks with page options', () => {
    // Arrange
    const pageOptions: PageOptionsDto = { take: 10, offset: 0 }
    const mockTrackDtos: TrackDto[] = [
      { id: '1', title: 'Track 1', images: [], artists: [], duration: 180, genres: [] },
      { id: '2', title: 'Track 2', images: [], artists: [], duration: 200, genres: [] },
    ]
    const mockResponse: PageResponseDto<TrackDto> = {
      data: mockTrackDtos,
      meta: { take: 2, offset: 0, itemCount: 2, pageCount: 1 },
    }
    const expectedTracks: Track[] = mockTrackDtos.map(trackMapper.mapTrackDtoToModel)

    vi.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse))
    vi.spyOn(trackMapper, 'mapTrackDtoToModel')

    // Act
    repository.get(pageOptions).subscribe((tracks) => {
      // Assert
      expect(tracks).toEqual(expectedTracks)
      expect(trackMapper.mapTrackDtoToModel).toHaveBeenCalledTimes(2)
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/tracks`, {
        params: pageOptions,
      })
    })
  })

  // Add a new test for getNew method
  it('should get new tracks', () => {
    // Arrange
    const mockTrackDtos: TrackDto[] = [
      { id: '1', title: 'New Track 1', images: [], artists: [], duration: 180, genres: [] },
      { id: '2', title: 'New Track 2', images: [], artists: [], duration: 200, genres: [] },
    ]
    const mockResponse: PageResponseDto<TrackDto> = {
      data: mockTrackDtos,
      meta: { take: 2, offset: 0, itemCount: 2, pageCount: 1 },
    }
    const expectedTracks: Track[] = mockTrackDtos.map(trackMapper.mapTrackDtoToModel)

    vi.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse))
    vi.spyOn(trackMapper, 'mapTrackDtoToModel')

    // Act
    repository.getNew().subscribe((tracks) => {
      // Assert
      expect(tracks).toEqual(expectedTracks)
      expect(trackMapper.mapTrackDtoToModel).toHaveBeenCalledTimes(2)
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/tracks/new`, {
        params: { take: 6, offset: 0 },
      })
    })
  })
})
