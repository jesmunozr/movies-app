import type { Meta, StoryObj } from '@storybook/react-vite';

import Counter from './Counter';

const meta = {
  title: "movies-app/Counter",
  component: Counter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "initialValue": 0
  },
};