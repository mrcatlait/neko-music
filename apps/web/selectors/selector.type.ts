const _selectors = [
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
  'list-item',
] as const

const _names = [
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
  'listItem',
] as const

type SelectorSuffix = (typeof _selectors)[number]
export type SelectorWithSuffix = `${string}-${SelectorSuffix}`

type NameSuffix = (typeof _names)[number]
type NameWithSuffix = `${string}${Capitalize<NameSuffix>}`

export type Selectors = Record<NameWithSuffix, SelectorWithSuffix>
