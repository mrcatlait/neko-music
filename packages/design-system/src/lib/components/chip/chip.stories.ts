import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular'

import { Chip } from './chip'

type ChipStoryArgs = {
  label: string
  disabled: boolean
}

const meta: Meta<ChipStoryArgs> = {
  title: 'Components/Chip',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Chip],
    }),
  ],
  args: {
    label: 'Electronica',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <button nChip type="button" [disabled]="disabled">
        {{ label }}
      </button>
    `,
  }),
}

export default meta
type Story = StoryObj<ChipStoryArgs>

export const Playground: Story = {}

export const ElementSelector: Story = {
  render: (args) => ({
    props: args,
    template: `
      <n-chip>
        {{ label }}
      </n-chip>
    `,
  }),
}

export const WithLeadingIcon: Story = {
  render: () => ({
    template: `
      <button nChip type="button">
        <i class="outlined">music_note</i>
        Ambient
      </button>
    `,
  }),
}
