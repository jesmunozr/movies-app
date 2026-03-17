import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import Search from './Search';

const meta = {
  title: "movies-app/Search",
  component: Search,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSearch: fn()
  },
} satisfies Meta<typeof Search>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialQuery: "Inception",
  },
};

export const EmptyInitialQuery: Story = {
  args: {
    initialQuery: "",
  },
};

