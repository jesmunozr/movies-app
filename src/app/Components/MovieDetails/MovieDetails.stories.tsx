import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from "msw";
import MovieDetails from './MovieDetails';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';

function RouterWrapper({
  children,
  context,
  initialEntries = ['/'],
}: {
  children: React.ReactNode;
  context: any;
  initialEntries?: string[];
}) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<Outlet context={context} />}>
          <Route path="/" element={children} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

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
  parameters: {
    msw: {
      handlers: [
        http.get("http://localhost:4000/movies/100", () => {
          return HttpResponse.json({
            title: "La La Land",
            tagline: "Here's to the fools who dream.",
            vote_average: 7.9,
            vote_count: 6782,
            release_date: "2016-12-29",
            poster_path: "https://image.tmdb.org/t/p/w500/ylXCdC106IKiarftHkcacasaAcb.jpg",
            overview: "Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician, scrapes by playing cocktail party gigs in dingy bars, but as success mounts they are faced with decisions that begin to fray the fragile fabric of their love affair, and the dreams they worked so hard to maintain in each other threaten to rip them apart.",
            budget: 30000000,
            revenue: 445435700,
            runtime: 128,
            genres: [
              "Comedy",
              "Drama",
              "Romance"
            ],
            id: 100
          });
        }),
      ],
    },
  },
  render: () => (
    <RouterWrapper context={{ movieId: 100 }}>
      <MovieDetails />
    </RouterWrapper>
  ),
};