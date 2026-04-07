import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, screen } from 'storybook/test';
import AddMovie from './AddMovie';
import './AddMovie.css';
import '../MovieForm/MovieForm.css';

const meta = {
  title: "movies-app/AddMovie",
  component: AddMovie,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AddMovie>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ShowAddMovieFormInModalWhenClicked: Story = {
  play: async ({ canvas, userEvent }) => {
      // Click the add movie button
      const addMovieButton = canvas.getByText(/add movie/i) as HTMLButtonElement;
      await userEvent.click(addMovieButton);
  
      // Verify Modal is rendered
      const modal = await screen.findByTestId("modal-overlay");
      await expect(modal).toBeInTheDocument();

      // Verify MovieForm is rendered inside the Modal with empty fields
      const titleInput = await screen.findByLabelText(/title/i) as HTMLInputElement;
      await expect(titleInput).toBeInTheDocument();
      await expect(titleInput.value).toBe("");
      const releaseDateInput = await screen.findByLabelText(/release date/i) as HTMLInputElement;
      await expect(releaseDateInput).toBeInTheDocument();
      await expect(releaseDateInput.value).toBe("");
      const genresInput = await screen.findByLabelText(/genres/i) as HTMLInputElement;
      await expect(genresInput).toBeInTheDocument();
      await expect(genresInput.value).toBe("");
      const durationInput = await screen.findByLabelText(/runtime/i) as HTMLInputElement;
      await expect(durationInput).toBeInTheDocument();
      await expect(durationInput.value).toBe("");
      const descriptionInput = await screen.findByLabelText(/overview/i) as HTMLTextAreaElement;
      await expect(descriptionInput).toBeInTheDocument();
      await expect(descriptionInput.value).toBe("");
      const ratingInput = await screen.findByLabelText(/rating/i) as HTMLInputElement;
      await expect(ratingInput).toBeInTheDocument();
      await expect(ratingInput.value).toBe("");
    },
};