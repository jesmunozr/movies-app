import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Genre from './Genre';


const meta = {
  title: "movies-app/Genre",
  component: Genre,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof Genre>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    genreList: [],
    selectedGenre: "",
  },
};

export const WithGenres: Story = {
  args: {
    genreList: ["Action", "Comedy", "Drama"],
    selectedGenre: "Comedy",
  },
};

export const NoSelectedGenre: Story = {
  args: {
    genreList: ["Action", "Comedy", "Drama"],
    selectedGenre: "",
  },
};
