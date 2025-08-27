import { DurationPipe } from './duration-pipe'

describe('DurationPipe', () => {
  let pipe: DurationPipe

  beforeEach(() => {
    pipe = new DurationPipe()
  })

  it('should transform duration of 0 to "0:00"', () => {
    const duration = 0
    const transformedDuration = pipe.transform(duration)
    expect(transformedDuration).toEqual('0:00')
  })

  it('should transform duration of 60 to "1:00"', () => {
    const duration = 60
    const transformedDuration = pipe.transform(duration)
    expect(transformedDuration).toEqual('1:00')
  })

  it('should transform duration of 90 to "1:30"', () => {
    const duration = 90
    const transformedDuration = pipe.transform(duration)
    expect(transformedDuration).toEqual('1:30')
  })

  it('should transform duration of 120 to "2:00"', () => {
    const duration = 120
    const transformedDuration = pipe.transform(duration)
    expect(transformedDuration).toEqual('2:00')
  })

  it('should transform duration of 3660 to "1:01:00"', () => {
    const duration = 3660
    const transformedDuration = pipe.transform(duration)
    expect(transformedDuration).toEqual('1:01:00')
  })
})
