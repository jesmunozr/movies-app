import { describe, it, expect, vi } from "vitest";
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import MovieListPage from "./MovieListPage";

describe("MovieListPage", () => {
    const mockMovies = [
        {
            imageUrl: "https://example.com/poster1.jpg",
            title: "Movie 1",
            releaseDate: new Date("2022-01-01"),
            genres: [
                { value: "action", label: "Action" },
                { value: "adventure", label: "Adventure" }
            ],
            duration: 120,
            description: "Description of Movie 1",
            rating: 8.5
        },
        {
            imageUrl: "https://example.com/poster2.jpg",
            title: "Movie 2",
            releaseDate: new Date("2023-01-01"),
            genres: [
                { value: "drama", label: "Drama" },
                { value: "romance", label: "Romance" }
            ],
            duration: 110,
            description: "Description of Movie 2",
            rating: 7.8
        }
    ];


    it("renders the MovieListPage component", async () => {
        render(<MovieListPage initialMovies={mockMovies} />);

        const searchComponent = screen.getByText(/find your movie/i);
        expect(searchComponent).toBeInTheDocument();

        const genreFilterComponent = screen.getByText(/all/i);
        expect(genreFilterComponent).toBeInTheDocument();

        const sortByComponent = screen.getByText(/sort by/i);
        expect(sortByComponent).toBeInTheDocument();

        expect(screen.getByText(/movie 1/i)).toBeInTheDocument();
        expect(screen.getByText(/movie 2/i)).toBeInTheDocument();
    });
});