import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Sort from './Sort';

const meta = {
  title: "movies-app/Sort",
  component: Sort,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    "onSortChange": fn(),
  },
} satisfies Meta<typeof Sort>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SortByTitle: Story = {
  args: {
    "sortBy": "title",
  },
};