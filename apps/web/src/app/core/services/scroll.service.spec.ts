import { TestBed } from '@angular/core/testing'
import { DOCUMENT } from '@angular/common'

import { ScrollService } from './scroll.service'

describe('ScrollService', () => {
  let scrollService: ScrollService
  let documentMock: Partial<Document>

  beforeEach(() => {
    documentMock = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [ScrollService, { provide: DOCUMENT, useValue: documentMock }],
    })

    scrollService = TestBed.inject(ScrollService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should disable scrolling', () => {
    // Act
    scrollService.disable()

    // Assert
    expect(documentMock.addEventListener).toHaveBeenCalledTimes(3)
    expect(documentMock.addEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), { passive: false })
    expect(documentMock.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false })
    expect(documentMock.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), { passive: false })
  })

  it('should enable scrolling', () => {
    // Act
    scrollService.enable()

    // Assert
    expect(documentMock.removeEventListener).toHaveBeenCalledTimes(3)
    expect(documentMock.removeEventListener).toHaveBeenCalledWith('wheel', expect.any(Function))
    expect(documentMock.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function))
    expect(documentMock.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should prevent default on wheel event', () => {
    // Arrange
    const wheelHandler = scrollService['handleWheel']
    const wheelEvent = new WheelEvent('wheel')
    const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault')

    // Act
    scrollService.disable()
    wheelHandler(wheelEvent)

    // Assert
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should prevent default on touchmove event', () => {
    // Arrange
    const wheelHandler = scrollService['handleWheel']
    const touchEvent = new TouchEvent('touchmove')
    const preventDefaultSpy = vi.spyOn(touchEvent, 'preventDefault')

    // Act
    wheelHandler(touchEvent)

    // Assert
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should prevent default on keydown event for specific keys', () => {
    // Arrange
    const handleKeydown = scrollService['handleKeydown']
    const targetElement = { tagName: 'DIV' } as HTMLElement
    const keydownEvent = new KeyboardEvent('keydown', { code: 'Space' })
    Object.defineProperty(keydownEvent, 'target', { value: targetElement })
    const preventDefaultSpy = vi.spyOn(keydownEvent, 'preventDefault')

    // Act
    scrollService.disable()
    handleKeydown(keydownEvent)

    // Assert
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should not prevent default on keydown event for non-specific keys', () => {
    // Arrange
    const handleKeydown = scrollService['handleKeydown']
    const targetElement = { tagName: 'DIV' } as HTMLElement
    const keydownEvent = new KeyboardEvent('keydown', { code: 'KeyA' })
    Object.defineProperty(keydownEvent, 'target', { value: targetElement })
    const preventDefaultSpy = vi.spyOn(keydownEvent, 'preventDefault')

    // Act
    handleKeydown(keydownEvent)

    // Assert
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('should allow specific keys in input and textarea elements', () => {
    // Arrange
    const handleKeydown = scrollService['handleKeydown']
    const inputElement = { tagName: 'INPUT' } as HTMLInputElement
    const keydownEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' })
    Object.defineProperty(keydownEvent, 'target', { value: inputElement })
    const preventDefaultSpy = vi.spyOn(keydownEvent, 'preventDefault')

    // Act
    handleKeydown(keydownEvent)

    // Assert
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })
})
