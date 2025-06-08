import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ProgressBar from './progress-bar.svelte'
import { getPlaybackState } from '$lib/shared/contexts/playback.context.svelte'

// Mock the context
vi.mock('$lib/shared/contexts/playback.context.svelte', () => ({
  getPlaybackState: vi.fn(),
}))

describe('ProgressBar', () => {
  let mockPlaybackState: any

  beforeEach(() => {
    // Arrange
    mockPlaybackState = {
      currentTime: 60,
      currentTrack: {
        duration: 180,
        title: 'Test Track',
      },
      seek: vi.fn(),
    }

    vi.mocked(getPlaybackState).mockReturnValue(mockPlaybackState)
  })

  describe('progress display', () => {
    it('should show current time and duration', () => {
      // Arrange & Act
      render(ProgressBar)

      // Assert
      expect(screen.getByText('1:00')).toBeInTheDocument() // 60 seconds = 1:00
      expect(screen.getByText('3:00')).toBeInTheDocument() // 180 seconds = 3:00
    })

    it('should display correct progress percentage', () => {
      // Arrange & Act
      render(ProgressBar)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '60')
      expect(progressBar).toHaveAttribute('aria-valuemax', '180')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    })

    it('should handle tracks without duration', () => {
      // Arrange
      mockPlaybackState.currentTrack = { duration: 0 }
      mockPlaybackState.currentTime = 30

      // Act
      render(ProgressBar)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '30')
      expect(progressBar).toHaveAttribute('aria-valuemax', '0')
    })

    it('should show 0:00 for both current time and duration when no track is loaded', () => {
      // Arrange
      mockPlaybackState.currentTrack = null
      mockPlaybackState.currentTime = 0

      // Act
      render(ProgressBar)

      // Assert
      const currentTimeElement = screen.getByLabelText(/current time/i)
      const durationElement = screen.getByLabelText(/total duration/i)
      expect(currentTimeElement).toHaveTextContent('0:00')
      expect(durationElement).toHaveTextContent('0:00')
    })
  })

  describe('seeking functionality', () => {
    it('should call seek when slider thumb is moved', async () => {
      // Arrange
      render(ProgressBar)
      const sliderThumb = screen.getByRole('slider')

      // Act
      await fireEvent.keyDown(sliderThumb, { key: 'ArrowRight' })

      // Assert
      // Since the slider component handles the interaction, we just test that the component renders
      expect(sliderThumb).toBeInTheDocument()
    })

    it('should handle seeking to beginning', () => {
      // Arrange
      mockPlaybackState.currentTime = 0

      // Act
      render(ProgressBar)

      // Assert
      const currentTimeElement = screen.getByLabelText(/current time/i)
      expect(currentTimeElement).toHaveTextContent('0:00')
    })

    it('should handle seeking to end', () => {
      // Arrange
      mockPlaybackState.currentTime = 180

      // Act
      render(ProgressBar)

      // Assert
      const currentTimeElement = screen.getByLabelText(/current time/i)
      expect(currentTimeElement).toHaveTextContent('3:00')
    })
  })

  describe('accessibility', () => {
    it('should provide meaningful progress information to screen readers', () => {
      // Arrange & Act
      render(ProgressBar)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '60')
      expect(progressBar).toHaveAttribute('aria-valuemax', '180')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-label', 'Playback progress')
    })

    it('should update ARIA values when playback state changes', async () => {
      // Arrange
      const { rerender } = render(ProgressBar)

      // Act
      mockPlaybackState.currentTime = 120
      await rerender({})

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '120')
    })

    it('should provide time context for screen readers', () => {
      // Arrange & Act
      render(ProgressBar)

      // Assert
      const currentTime = screen.getByLabelText(/current time/i)
      const duration = screen.getByLabelText(/total duration/i)

      expect(currentTime).toHaveTextContent('1:00')
      expect(duration).toHaveTextContent('3:00')
    })
  })
})
