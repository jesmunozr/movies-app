import { describe, it, expect, vi, afterEach } from "vitest";
import {render, screen, fireEvent} from '@testing-library/react';
import { useMoviesInfinite } from "@/Services/apiClient.ts";
import MovieListPage from "./MovieListPage";
import type { ApiMovie, ApiPageResponse } from "@/api/models/Movie";
import userEvent from "@testing-library/user-event";

describe("MovieListPage", () => {
    const mockMovies = [
        {
            title: "Movie 1",
            tagline: "Tagline of Movie 1",
            vote_average: 8.5,
            vote_count: 1500,
            release_date: "2022-01-01",
            poster_path: "https://example.com/poster1.jpg",
            overview: "Description of Movie 1",
            budget: 100000000,
            revenue: 500000000,
            runtime: 120,
            genres: ["Action", "Adventure"],
            id: 1,
        },
        {
            title: "Movie 2",
            tagline: "Tagline of Movie 2",
            vote_average: 7.8,
            vote_count: 800,
            release_date: "2023-01-01",
            poster_path: "https://example.com/poster2.jpg",
            overview: "Description of Movie 2",
            budget: 50000000,
            revenue: 200000000,
            runtime: 110,
            genres: ["Drama", "Romance"],
            id: 2,
        }
    ] as ApiMovie[];


    it("renders the MovieListPage component", async () => {

        vi.mock("@/Services/apiClient", () => ({
            useMoviesInfinite: vi.fn(),
        }));

        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue({
            content: {
                data: mockMovies,
                totalAmount: 2,
                offset: 0,
                limit: 10,
            } as ApiPageResponse,
            isLoading: false,
            isError: undefined,
            loadMore: vi.fn(),
            isReachingEnd: true,
        });

        render(<MovieListPage />);

        const searchComponent = screen.getByText(/find your movie/i);
        expect(searchComponent).toBeInTheDocument();

        const genreFilterComponent = screen.getByText(/all/i);
        expect(genreFilterComponent).toBeInTheDocument();

        const sortByComponent = screen.getByText(/sort by/i);
        expect(sortByComponent).toBeInTheDocument();

        expect(screen.getByText(/movie 1/i)).toBeInTheDocument();
        expect(screen.getByText(/movie 2/i)).toBeInTheDocument();
    });

    it("loadMore is not called when isLoading is true", () => {
        const loadMoreMock = vi.fn();

        vi.mock("@/Services/apiClient", () => ({
            useMoviesInfinite: vi.fn(),
        }));

        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue({
            content: undefined,
            isLoading: true,
            isError: undefined,
            loadMore: loadMoreMock,
            isReachingEnd: false,
        });

        render(<MovieListPage />);

        expect(loadMoreMock).not.toHaveBeenCalled();
    });

    it("renders a load message when movies are loading", () => {
        vi.mock("@/Services/apiClient", () => ({
            useMoviesInfinite: vi.fn(),
        }));

        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue({
            content: undefined,
            isLoading: true,
            isError: undefined,
            loadMore: vi.fn(),
            isReachingEnd: false,
        });

        render(<MovieListPage />);

        expect(screen.getByText(/loading movies/i)).toBeInTheDocument();
    });

    it("renders an error message when there is an error loading movies", () => {
        vi.mock("@/Services/apiClient", () => ({
            useMoviesInfinite: vi.fn(),
        }));

        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue({
            content: undefined,
            isLoading: false,
            isError: new Error("Failed fetching movies"),
            loadMore: vi.fn(),
            isReachingEnd: false,
        });

        render(<MovieListPage />);

        expect(screen.getByText(/failed to load movies/i)).toBeInTheDocument();
    });

    it("calls loadMore when scrolling to the bottom of the page", () => {
        const loadMoreMock = vi.fn();
        vi.mock("@/Services/apiClient", () => ({
            useMoviesInfinite: vi.fn(),
        }));
        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue({
            content: {
                data: mockMovies,
                totalAmount: 2,
                offset: 0,
                limit: 10,
            } as ApiPageResponse,
            isLoading: false,
            isError: undefined,
            loadMore: loadMoreMock,
            isReachingEnd: false,
        });

        render(<MovieListPage />);

        // Simulate scrolling to the bottom of the page
        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            value: 1000,
        });

        Object.defineProperty(window, "scrollY", {
            configurable: true,
            value: 1000,
        });

        Object.defineProperty(document.body, "offsetHeight", {
            configurable: true,
            value: 1500,
        });

        fireEvent.scroll(window);

        expect(loadMoreMock).toHaveBeenCalled();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
});