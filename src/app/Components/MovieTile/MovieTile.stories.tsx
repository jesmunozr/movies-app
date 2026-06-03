import type { Meta, StoryObj } from '@storybook/react-vite';
import MovieTile from './MovieTile';
import { fn, expect, screen } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

function RouterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={children} />
        <Route path="/:movieId/edit" element={<div data-testid="edit-route">Edit Movie</div>} />
        <Route path="/:movieId/delete" element={<div data-testid="delete-route">Delete Movie</div>} />
      </Routes>
    </MemoryRouter>
  );
}

const defaultArgs = {
  id: 100,
  imageUrl: "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/1526316550228-B0K75I48RK0Z7AN3CLP8/promo-teaser-and-poster-for-the-queen-biopic-bohemian-rhapsody",
  title: "Bohemian Rhapsody",
  releaseDate: new Date("2018-11-02"),
  genres: [
    { value: "docudrama", label: "Docudrama" },
    { value: "period-drama", label: "Period Drama" },
    { value: "showbiz-drama", label: "Showbiz Drama" },
    { value: "biography", label: "Biography" },
    { value: "drama", label: "Drama" },
    { value: "music", label: "Music" }
  ],
  duration: 134,
  description: "With his impeccable vocal abilities, Freddie Mercury and his rock band, Queen, achieve superstardom. However, amidst his skyrocketing success, he grapples with his ego, sexuality and a fatal illness."
};

const meta = {
  title: "movies-app/MovieTile",
  component: MovieTile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: fn()
  },
} satisfies Meta<typeof MovieTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: defaultArgs,
  render: (args) => (
    <RouterWrapper>
      <MovieTile {...args} />
    </RouterWrapper>
  ),
};

export const ShowModalWithMovieDetailsWhenEditClicked: Story = {
  args: defaultArgs,
  render: (args) => (
    <RouterWrapper>
      <MovieTile {...args} />
    </RouterWrapper>
  ),
  play: async ({ canvas, userEvent }) => {
    // Click the options button
    const optionsButton = canvas.getByText("⋮") as HTMLButtonElement;
    await userEvent.click(optionsButton);

    // Verify context menu appears with Edit and Delete options
    const contextMenu = await screen.findByTestId("context-menu");
    await expect(contextMenu).toBeInTheDocument();
    const editOption = await screen.findByText("Edit");
    const deleteOption = await screen.findByText("Delete");
    await expect(editOption).toBeInTheDocument();
    await expect(deleteOption).toBeInTheDocument();

    // Click Edit option
    await userEvent.click(editOption);

    // Verify navigation to edit route
    const editRoute = await screen.findByTestId("edit-route");
    await expect(editRoute).toBeInTheDocument();
  },
};

export const ShowModalWithDeleteMessageWhenDeleteClicked: Story = {
  args: defaultArgs,
  render: (args) => (
    <RouterWrapper>
      <MovieTile {...args} />
    </RouterWrapper>
  ),
  play: async ({ canvas, userEvent }) => {
    // Click the options button
    const optionsButton = canvas.getByText("⋮") as HTMLButtonElement;
    await userEvent.click(optionsButton);

    // Verify context menu appears with Edit and Delete options
    const contextMenu = await screen.findByTestId("context-menu");
    await expect(contextMenu).toBeInTheDocument();
    const editOption = await screen.findByText("Edit");
    const deleteOption = await screen.findByText("Delete");
    await expect(editOption).toBeInTheDocument();
    await expect(deleteOption).toBeInTheDocument();

    // Click Delete option
    await userEvent.click(deleteOption);

    // Verify navigation to delete route
    const deleteRoute = await screen.findByTestId("delete-route");
    await expect(deleteRoute).toBeInTheDocument();
  },
};