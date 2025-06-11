import { render } from '@testing-library/svelte'
import PlaybackQueue from './playback-queue.svelte'

import { mockContext } from '@/shared/test-utils'
import { PLAYBACK_CONTEXT_KEY } from '@/shared/contexts'
import { PlaybackState } from '@/shared/states'

describe('PlaybackQueue', () => {
  let state: PlaybackState

  beforeEach(() => {
    state = new PlaybackState()
  })

  describe('queue display', () => {
    it('should show the queue', () => {
      // Arrange
      const { getByTestId } = render(PlaybackQueue, {
        context: mockContext(PLAYBACK_CONTEXT_KEY, state),
      })

      // Act
      const queue = getByTestId('playback-queue')

      // Assert
      expect(queue).toBeInTheDocument()
    })

    it('should show the tracks in the queue', () => {
      // Arrange
      const { getAllByTestId } = render(PlaybackQueue, {
        context: mockContext(PLAYBACK_CONTEXT_KEY, state),
      })

      // Act
      const tracks = getAllByTestId('playback-queue-track')

      // Assert
      expect(tracks).toHaveLength(3)
    })
  })
})
