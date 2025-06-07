/**
 * Fisher-Yates shuffle algorithm
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}
