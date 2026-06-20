import { TimeAgoPipe } from './time-ago-pipe'

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe

  beforeEach(() => {
    pipe = new TimeAgoPipe()
  })

  it('should transform a date to "a moment ago" if the date is the current date', () => {
    const date = new Date()
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('a moment ago')
  })

  it('should transform a date to "1 hour ago" if the date is 1 hour ago', () => {
    const now = new Date()
    const hourInMs = 1 * 60 * 60 * 1000
    const date = new Date(now.getTime() - hourInMs)
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('1 hour ago')
  })

  it('should transform a date to "1 day ago" if the date is 1 day ago', () => {
    const now = new Date()
    const dayInMs = 1 * 24 * 60 * 60 * 1000
    const date = new Date(now.getTime() - dayInMs)
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('1 day ago')
  })

  it('should transform a date to "2 days ago" if the date is 2 days ago', () => {
    const now = new Date()
    const dayInMs = 2 * 24 * 60 * 60 * 1000
    const date = new Date(now.getTime() - dayInMs)
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('2 days ago')
  })

  it('should transform a date to "1 week ago" if the date is 1 week ago', () => {
    const now = new Date()
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000
    const date = new Date(now.getTime() - weekInMs)
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('1 week ago')
  })

  it('should transform a date to "1 month ago" if the date is 1 month ago', () => {
    const now = new Date()
    const monthInMs = 1 * 30 * 24 * 60 * 60 * 1000
    const date = new Date(now.getTime() - monthInMs)
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('1 month ago')
  })

  it('should transform a date to "1 year ago" if the date is 1 year ago', () => {
    const now = new Date()
    const yearInMs = 1 * 365 * 24 * 60 * 60 * 1000
    const date = new Date(now.getTime() - yearInMs)
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('1 year ago')
  })

  it('should transform a date to "10 years ago" if the date is 10 years ago', () => {
    const now = new Date()
    const tenYearsInMs = 10 * 365 * 24 * 60 * 60 * 1000
    const date = new Date(now.getTime() - tenYearsInMs)
    const transformedDate = pipe.transform(date)
    expect(transformedDate).toEqual('10 years ago')
  })
})
