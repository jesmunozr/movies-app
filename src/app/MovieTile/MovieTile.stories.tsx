import type { Meta, StoryObj } from '@storybook/react-vite';
import MovieTile from './MovieTile';
import { fn, expect, screen } from 'storybook/test';

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
  args: {
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
  },
};

export const ShowModalWithMovieDetailsWhenEditClicked: Story = {
  args: {
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
  },
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

    // Verify Modal is rendered
    const modal = await screen.findByTestId("modal-overlay");
    await expect(modal).toBeInTheDocument();

    // Verify MovieForm is populated with correct movie details
    expect(await screen.findByTestId("movie-form")).toBeInTheDocument();
    await expect(screen.getByDisplayValue("Bohemian Rhapsody")).toBeInTheDocument();
    await expect(screen.getByDisplayValue("With his impeccable vocal abilities, Freddie Mercury and his rock band, Queen, achieve superstardom. However, amidst his skyrocketing success, he grapples with his ego, sexuality and a fatal illness.")).toBeInTheDocument();
    await expect(screen.getByDisplayValue("134")).toBeInTheDocument();
    await expect(screen.getByDisplayValue("2018-11-02")).toBeInTheDocument();
    await expect(screen.getByText("Drama")).toBeInTheDocument();
  },
};

export const ShowModalWithDeleteMessageWhenDeleteClicked: Story = {
  args: {
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
  },
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

    // Verify Modal is rendered
    const modal = await screen.findByTestId("modal-overlay");
    await expect(modal).toBeInTheDocument();

    // Verify delete confirmation message is displayed
    const deleteMessage = await screen.findByText("Are you sure you want to delete this movie?");
    await expect(deleteMessage).toBeInTheDocument();
    const deleteButton = await screen.findByText("Delete");
    await expect(deleteButton).toBeInTheDocument();
  },
};