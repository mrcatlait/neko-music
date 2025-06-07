import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import PlayerControls from './player-controls.svelte'
import { getPlaybackState } from '$lib/shared/contexts/playback.context.svelte'
import { PLAYBACK_STATUS, REPEAT_OPTIONS } from '$lib/shared/enums'

// Mock the context
vi.mock('$lib/shared/contexts/playback.context.svelte', () => ({
  getPlaybackState: vi.fn(),
}))

describe('PlayerControls', () => {
  let mockPlaybackState: any

  beforeEach(() => {
    // Arrange
    mockPlaybackState = {
      status: PLAYBACK_STATUS.Paused,
      shuffle: false,
      repeat: REPEAT_OPTIONS.None,
      hasPrevious: true,
      hasNext: true,
      currentTime: 30,
      play: vi.fn(),
      pause: vi.fn(),
      next: vi.fn(),
      previous: vi.fn(),
      toggleShuffle: vi.fn(),
      toggleRepeat: vi.fn(),
      seek: vi.fn(),
    }

    vi.mocked(getPlaybackState).mockReturnValue(mockPlaybackState)
  })

  describe('play/pause button', () => {
    it('should display play button when paused', () => {
      // Arrange
      mockPlaybackState.status = PLAYBACK_STATUS.Paused

      // Act
      render(PlayerControls)

      // Assert
      const playButton = screen.getByRole('button', { name: /play/i })
      expect(playButton).toBeInTheDocument()
      expect(playButton).toHaveAttribute('aria-label', 'Play')
    })

    it('should display pause button when playing', () => {
      // Arrange
      mockPlaybackState.status = PLAYBACK_STATUS.Playing

      // Act
      render(PlayerControls)

      // Assert
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      expect(pauseButton).toBeInTheDocument()
      expect(pauseButton).toHaveAttribute('aria-label', 'Pause')
    })

    it('should call play when play button is clicked', async () => {
      // Arrange
      mockPlaybackState.status = PLAYBACK_STATUS.Paused
      render(PlayerControls)
      const playButton = screen.getByRole('button', { name: /play/i })

      // Act
      await fireEvent.click(playButton)

      // Assert
      expect(mockPlaybackState.play).toHaveBeenCalled()
    })

    it('should call pause when pause button is clicked', async () => {
      // Arrange
      mockPlaybackState.status = PLAYBACK_STATUS.Playing
      render(PlayerControls)
      const pauseButton = screen.getByRole('button', { name: /pause/i })

      // Act
      await fireEvent.click(pauseButton)

      // Assert
      expect(mockPlaybackState.pause).toHaveBeenCalled()
    })
  })

  describe('previous button', () => {
    it('should be enabled when hasPrevious is true', () => {
      // Arrange
      mockPlaybackState.hasPrevious = true

      // Act
      render(PlayerControls)

      // Assert
      const previousButton = screen.getByRole('button', { name: /previous/i })
      expect(previousButton).not.toBeDisabled()
    })

    it('should be disabled when hasPrevious is false', () => {
      // Arrange
      mockPlaybackState.hasPrevious = false

      // Act
      render(PlayerControls)

      // Assert
      const previousButton = screen.getByRole('button', { name: /previous/i })
      expect(previousButton).toBeDisabled()
    })

    it('should call previous when clicked', async () => {
      // Arrange
      mockPlaybackState.hasPrevious = true
      render(PlayerControls)
      const previousButton = screen.getByRole('button', { name: /previous/i })

      // Act
      await fireEvent.click(previousButton)

      // Assert
      expect(mockPlaybackState.previous).toHaveBeenCalled()
    })
  })

  describe('next button', () => {
    it('should be enabled when hasNext is true', () => {
      // Arrange
      mockPlaybackState.hasNext = true

      // Act
      render(PlayerControls)

      // Assert
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).not.toBeDisabled()
    })

    it('should be disabled when hasNext is false', () => {
      // Arrange
      mockPlaybackState.hasNext = false

      // Act
      render(PlayerControls)

      // Assert
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toBeDisabled()
    })

    it('should call next when clicked', async () => {
      // Arrange
      mockPlaybackState.hasNext = true
      render(PlayerControls)
      const nextButton = screen.getByRole('button', { name: /next/i })

      // Act
      await fireEvent.click(nextButton)

      // Assert
      expect(mockPlaybackState.next).toHaveBeenCalled()
    })
  })

  describe('shuffle button', () => {
    it('should show inactive state when shuffle is false', () => {
      // Arrange
      mockPlaybackState.shuffle = false

      // Act
      render(PlayerControls)

      // Assert
      const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
      expect(shuffleButton).toHaveClass('inactive')
    })

    it('should show active state when shuffle is true', () => {
      // Arrange
      mockPlaybackState.shuffle = true

      // Act
      render(PlayerControls)

      // Assert
      const shuffleButton = screen.getByRole('button', { name: /shuffle/i })
      expect(shuffleButton).not.toHaveClass('inactive')
    })

    it('should call toggleShuffle when clicked', async () => {
      // Arrange
      render(PlayerControls)
      const shuffleButton = screen.getByRole('button', { name: /shuffle/i })

      // Act
      await fireEvent.click(shuffleButton)

      // Assert
      expect(mockPlaybackState.toggleShuffle).toHaveBeenCalled()
    })
  })

  describe('repeat button', () => {
    it('should show inactive repeat icon when repeat is None', () => {
      // Arrange
      mockPlaybackState.repeat = REPEAT_OPTIONS.None

      // Act
      render(PlayerControls)

      // Assert
      const repeatButton = screen.getByRole('button', { name: /repeat/i })
      const icon = repeatButton.querySelector('i')
      expect(icon).toHaveClass('inactive')
      expect(icon).toHaveTextContent('repeat')
    })

    it('should show active repeat icon when repeat is All', () => {
      // Arrange
      mockPlaybackState.repeat = REPEAT_OPTIONS.All

      // Act
      render(PlayerControls)

      // Assert
      const repeatButton = screen.getByRole('button', { name: /repeat/i })
      const icon = repeatButton.querySelector('i')
      expect(icon).not.toHaveClass('inactive')
      expect(icon).toHaveTextContent('repeat')
    })

    it('should show repeat_one icon when repeat is Single', () => {
      // Arrange
      mockPlaybackState.repeat = REPEAT_OPTIONS.Single

      // Act
      render(PlayerControls)

      // Assert
      const repeatButton = screen.getByRole('button', { name: /repeat/i })
      const icon = repeatButton.querySelector('i')
      expect(icon).toHaveTextContent('repeat_one')
    })

    it('should call toggleRepeat when clicked', async () => {
      // Arrange
      render(PlayerControls)
      const repeatButton = screen.getByRole('button', { name: /repeat/i })

      // Act
      await fireEvent.click(repeatButton)

      // Assert
      expect(mockPlaybackState.toggleRepeat).toHaveBeenCalled()
    })
  })

  describe('keyboard shortcuts', () => {
    it('should call play when spacebar is pressed', async () => {
      // Arrange
      render(PlayerControls)

      // Act
      await fireEvent.keyDown(window, { key: ' ' })

      // Assert
      expect(mockPlaybackState.play).toHaveBeenCalled()
    })

    it('should seek forward when right arrow is pressed', async () => {
      // Arrange
      mockPlaybackState.currentTime = 30
      render(PlayerControls)

      // Act
      await fireEvent.keyDown(window, { key: 'ArrowRight' })

      // Assert
      expect(mockPlaybackState.seek).toHaveBeenCalledWith(40)
    })

    it('should seek backward when left arrow is pressed', async () => {
      // Arrange
      mockPlaybackState.currentTime = 30
      render(PlayerControls)

      // Act
      await fireEvent.keyDown(window, { key: 'ArrowLeft' })

      // Assert
      expect(mockPlaybackState.seek).toHaveBeenCalledWith(20)
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels for all buttons', () => {
      // Arrange & Act
      render(PlayerControls)

      // Assert
      expect(screen.getByRole('button', { name: /play|pause/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /shuffle/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /repeat/i })).toBeInTheDocument()
    })

    it('should have proper semantic structure', () => {
      // Arrange & Act
      render(PlayerControls)

      // Assert
      const controlsSection = screen.getByRole('group', { name: /playback controls/i })
      expect(controlsSection).toBeInTheDocument()
    })
  })
})
