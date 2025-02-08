import { TestBed } from '@angular/core/testing'
import { NavigationStart, Router, RouterEvent } from '@angular/router'
import { Subject } from 'rxjs'

import { UIState } from './ui.state'

interface ExtendedRouter extends Omit<Router, 'events'> {
  events: Subject<RouterEvent>
}

describe('UIState', () => {
  let uiState: UIState
  let routerMock: Partial<ExtendedRouter>

  beforeEach(() => {
    routerMock = {
      events: new Subject<RouterEvent>(),
      navigate: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [UIState, { provide: Router, useValue: routerMock }],
    })

    uiState = TestBed.inject(UIState)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should toggle visualizer', () => {
    uiState.toggleVisualizer()
    expect(uiState.isVisualizerOpen()).toBe(true)

    uiState.toggleVisualizer()
    expect(uiState.isVisualizerOpen()).toBe(false)
  })

  it('should open visualizer', () => {
    uiState.openVisualizer()
    expect(uiState.isVisualizerOpen()).toBe(true)
  })

  it('should close visualizer', () => {
    uiState.closeVisualizer()
    expect(uiState.isVisualizerOpen()).toBe(false)
  })

  it('should close visualizer on navigation start', () => {
    const navigationStartEvent = new NavigationStart(1, 'url')
    routerMock.events?.next(navigationStartEvent)

    expect(uiState.isVisualizerOpen()).toBe(false)
  })
})
