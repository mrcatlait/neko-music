import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'

import { trackController } from '@features/music-metadata/controllers'

describe('Track', () => {
  describe('GET /tracks/new', () => {
    it('should return new tracks', async () => {
      const api = treaty(trackController())

      const response = await api.tracks.new.get()
      expect(response.status).toBe(200)

      expect(response.data?.data.length).toBe(0)
      expect(response.data?.meta.take).toBe(10)
      expect(response.data?.meta.offset).toBe(0)
      expect(response.data?.meta.hasNext).toBe(false)
      expect(response.data?.meta.hasPrevious).toBe(false)
    })
  })

  describe('GET /tracks/popular', () => {
    it('should return popular tracks', async () => {
      const api = treaty(trackController())

      const response = await api.tracks.popular.get()
      expect(response.status).toBe(200)

      expect(response.data?.data.length).toBe(0)
      expect(response.data?.meta.take).toBe(10)
      expect(response.data?.meta.offset).toBe(0)
      expect(response.data?.meta.hasNext).toBe(false)
      expect(response.data?.meta.hasPrevious).toBe(false)
    })
  })
})
