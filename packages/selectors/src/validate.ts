import * as selectors from './index'

/**
 * Validate that all selectors are unique
 */
export const validateSelectors = () => {
  console.log('Checking duplicate selectors...')

  const keys = Object.keys(selectors)

  const allSelectors = keys.map((key) => Object.values(selectors[key as keyof typeof selectors])).flat()

  const duplicates = allSelectors.filter((item, index) => allSelectors.indexOf(item) !== index)

  if (duplicates.length > 0) {
    throw new Error(`Duplicate selectors found: ${duplicates.join(', ')}`)
  }
}
