const selectors = [
  'label',
  'input',
  'textarea',
  'checkbox',
  'button',
  'chip',
  'slider',
  'card',
  'image',
  'container',
  'link',
  'text-field',
] as const

const names = [
  'label',
  'input',
  'textarea',
  'checkbox',
  'button',
  'chip',
  'slider',
  'card',
  'image',
  'container',
  'link',
  'textField',
] as const

type SelectorSuffix = (typeof selectors)[number]
export type SelectorWithSuffix = `${string}-${SelectorSuffix}`

type NameSuffix = (typeof names)[number]
type NameWithSuffix = `${string}${Capitalize<NameSuffix>}`

export type Selectors = Record<NameWithSuffix, SelectorWithSuffix>
