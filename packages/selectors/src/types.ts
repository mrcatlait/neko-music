// Core UI element suffixes
const _elements = ['button', 'input', 'textarea', 'checkbox', 'slider', 'link', 'image', 'label'] as const

// Container and layout suffixes
const _containers = ['container', 'wrapper', 'section', 'panel', 'card', 'list', 'item', 'group'] as const

// State and content suffixes
const _content = [
  'message',
  'text',
  'title',
  'description',
  'spinner',
  'loader',
  'indicator',
  'badge',
  'chip',
  'image',
  'icon',
] as const

// All allowed names
const _allNames = [..._elements, ..._containers, ..._content] as const

type SelectorSuffix = (typeof _allNames)[number]
export type SelectorWithSuffix = `${string}-${SelectorSuffix}`

type NameSuffix = (typeof _allNames)[number]
type NameWithSuffix = `${string}${Capitalize<NameSuffix>}`

export type Selectors = Record<NameWithSuffix, SelectorWithSuffix>
