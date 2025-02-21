import { InitialsPipe } from './initials.pipe'

describe('InitialsPipe', () => {
  let pipe: InitialsPipe

  beforeEach(() => {
    pipe = new InitialsPipe()
  })

  it('should create', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return empty string for undefined input', () => {
    expect(pipe.transform(undefined)).toBe('')
  })

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('')
  })

  it('should return first two chars for single word', () => {
    expect(pipe.transform('John')).toBe('Jo')
  })

  it('should return first and first char after space for multiple words', () => {
    expect(pipe.transform('John Doe')).toBe('JD')
  })

  it('should handle multiple spaces', () => {
    expect(pipe.transform('John Middle Doe')).toBe('JD')
  })
})
