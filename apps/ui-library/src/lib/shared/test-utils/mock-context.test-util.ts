export const mockContext = (key: string, value: any) => {
  return new Map(Object.entries({ [key]: value }))
}
