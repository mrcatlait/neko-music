import type { Meta, StoryObj } from '@storybook/angular'
import { moduleMetadata } from '@storybook/angular'

import { Button, type ButtonColor, type ButtonVariant } from './button'

type ButtonStoryArgs = {
  label: string
  variant: ButtonVariant
  color: ButtonColor
  disabled: boolean
}

const meta: Meta<ButtonStoryArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Button],
    }),
  ],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['filled', 'outlined', 'text'] satisfies ButtonVariant[],
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'secondary'] satisfies ButtonColor[],
    },
  },
  args: {
    label: 'Play now',
    variant: 'filled',
    color: 'primary',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <button
        nButton
        type="button"
        [variant]="variant"
        [color]="color"
        [disabled]="disabled"
      >
        {{ label }}
      </button>
    `,
  }),
}

export default meta
type Story = StoryObj<ButtonStoryArgs>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <button nButton variant="filled">Filled</button>
        <button nButton variant="outlined">Outlined</button>
        <button nButton variant="text">Text</button>
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <button nButton color="primary">Primary</button>
        <button nButton color="secondary">Secondary</button>
      </div>
    `,
  }),
}

export const FocusVisible: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.focus()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
