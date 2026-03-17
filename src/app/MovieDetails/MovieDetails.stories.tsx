import type { Meta, StoryObj } from '@storybook/react-vite';

import MovieDetails from './MovieDetails';
import { fn } from 'storybook/test';

const meta = {
  title: "movies-app/MovieDetails",
  component: MovieDetails,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MovieDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageUrl: "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/1526316550228-B0K75I48RK0Z7AN3CLP8/promo-teaser-and-poster-for-the-queen-biopic-bohemian-rhapsody",
    title: "Bohemian Rhapsody",
    releaseDate: new Date("2018-11-02"),
    genres: ["Docudrama", "Period Drama", "Showbiz Drama", "Biography", "Drama", "Music"],
    duration: 134,
    description: "With his impeccable vocal abilities, Freddie Mercury and his rock band, Queen, achieve superstardom. However, amidst his skyrocketing success, he grapples with his ego, sexuality and a fatal illness.",
    rating: 8.9
  },
};